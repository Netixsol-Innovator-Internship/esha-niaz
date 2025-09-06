'use client';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useGetMeQuery, useGetNotificationsQuery, useMarkNotificationReadMutation } from '../lib/services/api'; // RTK query hooks

export default function NotificationBell() {
  const [open, setOpen] = useState(false);

  // 1️⃣ Get logged-in user
  const { data: me, isLoading: loadingMe } = useGetMeQuery();
  const userId = me?._id;

  // 2️⃣ Fetch notifications for this user
  const { data: notifications = [], refetch } = useGetNotificationsQuery(userId, {
    skip: !userId,
  });

  // 3️⃣ Mark as read mutation
  const [markRead] = useMarkNotificationReadMutation();

  // 4️⃣ Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;

  // 5️⃣ Setup Socket.IO for real-time updates
  useEffect(() => {
    if (!userId) return;
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000', {
      auth: { userId, role: me?.role },
    });

    socket.on('order.status.changed', () => refetch());
    socket.on('order.created', () => refetch());
    socket.on('sale.started', () => refetch());
    socket.on('product.soldout', () => refetch());

    return () => socket.disconnect();
  }, [userId, me?.role]);

  // 6️⃣ Handle marking notification as read
  const handleMarkRead = async (id) => {
    try {
      await markRead(id).unwrap();
      refetch();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  // 7️⃣ Loading state
  if (loadingMe) return null;

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative text-xl focus:outline-none"
        title="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 right-2 text-xs bg-red-600 text-white rounded-full px-1.5">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications pop-up */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white border rounded shadow-lg overflow-y-auto z-50">
          {notifications.length === 0 && (
            <div className="text-sm text-gray-500 p-2">No notifications</div>
          )}
          {notifications.map(n => (
            <div
              key={n._id}
              onClick={() => handleMarkRead(n._id)}
              className={`p-3 border-b cursor-pointer flex items-start gap-2 text-sm transition-colors
                ${!n.read ? 'bg-gray-100 font-medium' : 'bg-white text-gray-700'} hover:bg-gray-200`}
            >
              {!n.read && (
                <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              )}
              <div className="flex-1">
                <div className="text-gray-800">{n.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
