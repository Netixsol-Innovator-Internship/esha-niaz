'use client';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { notificationApi } from '../services/notificationApi';
import { commentApi } from '../services/commentApi';

const SocketContext = createContext(null);

export default function SocketProvider({ children }) {
  const token = useSelector(s => s.auth.token);
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }
    const s = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
      transports: ['websocket'],
      auth: { token },
    });
    setSocket(s);

    s.on('connect', () => { /* connected */ });
    s.on('connected', () => {});
    s.on('auth_error', (p)=>{ console.warn('Socket auth error', p); });

    // generic notifications
    s.on('notification', (_payload) => {
      // refresh notifications list + unread count
      dispatch(notificationApi.util.invalidateTags(['Notifications']));
    });

    s.on('unread_count', ({ count }) => setUnread(count || 0));

    // New comment broadcast -> refresh comments
    s.on('new_comment', (_payload) => {
      dispatch(commentApi.util.invalidateTags(['Comments']));
    });

    // like/follow notifications if any
    s.on('like_notification', () => {
      dispatch(notificationApi.util.invalidateTags(['Notifications']));
    });
    s.on('follow_notification', () => {
      dispatch(notificationApi.util.invalidateTags(['Notifications']));
    });

    return () => {
      s.disconnect();
    };
  }, [token]);

  const value = useMemo(() => ({ socket, unread }), [socket, unread]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export const useSocket = () => useContext(SocketContext);




// 'use client';
// import { createContext, useContext, useEffect, useMemo, useState } from 'react';
// import { io } from 'socket.io-client';
// import { useDispatch, useSelector } from 'react-redux';
// import { notificationApi } from '../services/notificationApi';
// import { commentApi } from '../services/commentApi';

// const SocketContext = createContext(null);

// export default function SocketProvider({ children }) {
//   const token = useSelector(s => s.auth.token);
//   const dispatch = useDispatch();
//   const [socket, setSocket] = useState(null);
//   const [unread, setUnread] = useState(0);

//   useEffect(() => {
//     if (!token) {
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//       return;
//     }

//     const s = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000', {
//       transports: ['websocket'],
//       auth: { token },
//     });
//     setSocket(s);

//     s.on('connect', () => { /* connected */ });
//     s.on('connected', () => {});
//     s.on('auth_error', (p)=>{ console.warn('Socket auth error', p); });

//     // 🔔 generic notifications
//     s.on('notification', () => {
//       dispatch(notificationApi.util.invalidateTags(['Notifications']));
//     });

//     s.on('unread_count', ({ count }) => setUnread(count || 0));

//     // 📝 New comment broadcast -> patch comments cache directly
//     s.on('new_comment', (payload) => {
//       const newComment = payload?.comment;
//       if (!newComment) return;

//       dispatch(
//         commentApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//           if (!draft?.comments) return;
//           draft.comments.unshift(newComment);
//           if (typeof draft.total === 'number') draft.total += 1;
//         })
//       );
//     });

//     // ✏️ Comment update broadcast
//     s.on('update_comment', (payload) => {
//       const updated = payload?.comment;
//       if (!updated) return;

//       dispatch(
//         commentApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//           if (!draft?.comments) return;
//           const idx = draft.comments.findIndex(c => c._id === updated._id);
//           if (idx !== -1) draft.comments[idx] = updated;
//         })
//       );
//     });

//     // ❌ Comment delete broadcast
//     s.on('delete_comment', ({ id }) => {
//       if (!id) return;

//       dispatch(
//         commentApi.util.updateQueryData('getAllComments', { page: 1, limit: 10 }, (draft) => {
//           if (!draft?.comments) return;
//           draft.comments = draft.comments.filter(c => c._id !== id);
//           if (typeof draft.total === 'number') draft.total -= 1;
//         })
//       );
//     });

//     // 💬 Reply broadcast
//     s.on('new_reply', (payload) => {
//       const reply = payload?.reply;
//       const parentId = payload?.parentId;
//       if (!reply || !parentId) return;

//       dispatch(
//         commentApi.util.updateQueryData('getReplies', { id: parentId, page: 1, limit: 5 }, (draft) => {
//           if (!draft?.replies) return;
//           draft.replies.unshift(reply);
//           if (typeof draft.total === 'number') draft.total += 1;
//         })
//       );
//     });

//     // 👍 like/follow notifications
//     s.on('like_notification', () => {
//       dispatch(notificationApi.util.invalidateTags(['Notifications']));
//     });
//     s.on('follow_notification', () => {
//       dispatch(notificationApi.util.invalidateTags(['Notifications']));
//     });

//     return () => {
//       s.disconnect();
//     };
//   }, [token]);

//   const value = useMemo(() => ({ socket, unread }), [socket, unread]);
//   return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
// }

// export const useSocket = () => useContext(SocketContext);
