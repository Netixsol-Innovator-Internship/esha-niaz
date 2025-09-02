// 'use client';
// import { createContext, useContext, useEffect, useMemo } from 'react';
// import { io } from 'socket.io-client';
// import { useDispatch } from 'react-redux';
// import { api } from '../redux/api';

// const SocketContext = createContext(null);
// export const useSocket = () => useContext(SocketContext);

// export default function SocketProvider({ children }) {
//   const dispatch = useDispatch();
//   const socket = useMemo(() => {
//     const url = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
//     return io(url, { transports: ['websocket'], withCredentials: true });
//   }, []);

//   useEffect(() => {
//     if (!socket) return;
//     socket.on('connect', () => {});
//     socket.on('bid:new', () => dispatch(api.util.invalidateTags(['Auction','Bid'])));
//     socket.on('cars:updated', () => dispatch(api.util.invalidateTags(['Auction'])));
//     socket.on('notification', () => dispatch(api.util.invalidateTags(['Notification'])));
//     return () => socket.disconnect();
//   }, [socket, dispatch]);

//   return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
// }





'use client';
import { createContext, useContext, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { api } from '../redux/api';
import { toast } from '../../components/Toaster';

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export default function SocketProvider({ children }) {
  const dispatch = useDispatch();

  const socket = useMemo(() => {
    const url =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      '';

    // send token in auth if present (many servers expect it)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    return io(url, {
      transports: ['websocket'],
      withCredentials: true,
      auth: token ? { token } : undefined,
      // optional: path, reconnectionAttempts, etc
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('connect', () => {
      console.log('[socket] connected', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[socket] disconnected', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('[socket] connect_error', err?.message || err);
    });

    // When a new notification arrives, *patch* notifications cache for instant UI update
    socket.on('notification', (docOrLite) => {
      try {
        console.log('[socket] notification received', docOrLite);

        // Try to patch the notifications query cache if present
        dispatch(
          api.util.updateQueryData('notifications', undefined, (draft) => {
            // Create a normalized notification object if backend sent a "lite" payload
            const newNotif = docOrLite && docOrLite._id
              ? docOrLite
              : {
                  _id: docOrLite._id || `temp-${Date.now()}`,
                  type: docOrLite?.type || 'Notification',
                  comment: docOrLite?.comment || (docOrLite?.type === 'New' ? `New bid ${docOrLite?.amount}` : 'Auction update'),
                  read: false,
                  createdAt: docOrLite?.createdAt || new Date().toISOString(),
                  ...docOrLite,
                };

            // Avoid duplicate _id if already present
            const exists = draft.find((d) => (d._id || d.id) === newNotif._id);
            if (!exists) {
              draft.unshift(newNotif);
            }
          })
        );
      } catch (err) {
        console.warn('[socket] updateQueryData failed, falling back to invalidateTags', err);
        // fallback to invalidation (causes RTK Query to refetch)
        dispatch(api.util.invalidateTags(['Notification']));
      }

      // small toast UX
      const type = docOrLite?.type || 'Notification';
      toast?.(`New ${type} notification`);
    });

    // Keep your other handlers intact (bid, auction)
    socket.on('bid:new', (p) => {
      console.log('[socket] bid:new', p);
      // patch caches (auction/bids) if you want instant UI; fallback to invalidate
      try {
        // update auction detail if present
        if (p?.carId) {
          dispatch(
            api.util.updateQueryData('auctionById', p.carId, (draft) => {
              if (draft) {
                draft.currentBid = p.currentBid ?? p.amount ?? draft.currentBid;
                draft.totalBids = p.totalBids ?? (draft.totalBids || 0) + 1;
              }
            })
          );

          // update bids list if loaded
          dispatch(
            api.util.updateQueryData('bidsForAuction', p.carId, (draft) => {
              // Minimal bid object (backend might not supply full)
              const newBid = {
                _id: p._id || `temp-${Date.now()}`,
                amount: p.amount,
                user: p.user || { _id: p.userId, username: p.userName || 'Someone' },
                createdAt: new Date().toISOString(),
                ...p,
              };
              draft.unshift(newBid);
            })
          );
        }
      } catch (e) {
        dispatch(api.util.invalidateTags(['Bid', 'Auction']));
      }
    });

    socket.on('auction:start', (p) => {
      console.log('[socket] auction:start', p);
      // try to patch liveAuctions list
      try {
        dispatch(api.util.updateQueryData('liveAuctions', undefined, (draft) => {
          if (!draft.find((a) => (a._id || a.id) === (p.carId || p._id))) {
            const newItem = {
              _id: p.carId || p._id,
              make: p.make,
              carModel: p.model || p.carModel,
              currentBid: p.currentBid || p.startingBid || 0,
              ...(p || {}),
            };
            draft.unshift(newItem);
          }
        }));
      } catch (e) {
        dispatch(api.util.invalidateTags(['Auction']));
      }
      toast?.(`Auction started: ${p.make || ''} ${p.model || ''}`.trim());
    });

    socket.on('auction:end', (p) => {
      console.log('[socket] auction:end', p);
      try {
        // update auction detail
        if (p?.carId) {
          dispatch(
            api.util.updateQueryData('auctionById', p.carId, (draft) => {
              if (draft) {
                draft.ended = true;
                draft.topBid = p.topBid ?? draft.topBid;
                draft.topBidder = p.topBidder ?? draft.topBidder;
              }
            })
          );

          // remove or mark in liveAuctions
          dispatch(
            api.util.updateQueryData('liveAuctions', undefined, (draft) => {
              const idx = draft.findIndex((a) => (a._id || a.id) === p.carId);
              if (idx !== -1) draft.splice(idx, 1);
            })
          );
        }
      } catch (e) {
        dispatch(api.util.invalidateTags(['Auction']));
      }

      toast?.(`Auction ended.`);
    });

    // cleanup
    return () => {
      socket.removeAllListeners();
      try {
        socket.disconnect();
      } catch (e) {}
    };
  }, [socket, dispatch]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}
