// 'use client';
// import { useNotificationsQuery, useMarkNotificationReadMutation } from '../src/redux/api';
// import { useState } from 'react';

// export default function NotificationBell() {
//   const { data: notifications } = useNotificationsQuery();
//   const [open, setOpen] = useState(false);
//   const [mark] = useMarkNotificationReadMutation();

//   const unread = (notifications || []).filter(n => !n.read).length;

//   return (
//     <div className="relative">
//       <button onClick={() => setOpen(o => !o)} className="relative">
//         🔔 {unread > 0 && <span className="text-xs bg-red-600 text-white rounded-full px-1">{unread}</span>}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white border rounded p-2 z-50 shadow-lg">
//           {(notifications || []).map(n => (
//             <div key={n._id || n.id} className="p-2 border-b text-sm">
//               <div className="text-gray-800">{n.comment || 'No message'}</div>
//               <div className="text-xs text-black mt-1">
//                 <button
//                   className="text-blue-600 hover:underline"
//                   onClick={async () => {
//                     await mark(n._id || n.id);
//                   }}
//                 >
//                   Mark read
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';
// import { useNotificationsQuery, useMarkNotificationReadMutation } from '../src/redux/api';
// import { useState, useEffect } from 'react';

// export default function NotificationBell() {
//   const { data: notificationsData } = useNotificationsQuery();
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [mark] = useMarkNotificationReadMutation();

//   // Initialize notifications when data from API changes
//   useEffect(() => {
//     if (notificationsData) setNotifications(notificationsData);
//   }, [notificationsData]);

//   const unread = notifications.filter(n => !n.read).length;

//   const handleMarkRead = async (id) => {
//     try {
//       await mark(id).unwrap(); // mark as read in backend
//       // Remove from local state so it disappears from dropdown
//       setNotifications(prev => prev.filter(n => (n._id || n.id) !== id));
//     } catch (err) {
//       console.error('Failed to mark notification read:', err);
//     }
//   };

//   return (
//     <div className="relative">
//       <button onClick={() => setOpen(o => !o)} className="relative">
//         🔔 {unread > 0 && <span className="text-xs bg-red-600 text-white rounded-full px-1">{unread}</span>}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white border rounded p-2 z-50 shadow-lg">
//           {notifications.length === 0 && <div className="text-sm text-gray-500 p-2">No notifications</div>}
//           {notifications.map(n => (
//             <div key={n._id || n.id} className="p-2 border-b text-sm">
//               <div className="text-gray-800">{n.comment || 'No message'}</div>
//               <div className="text-xs text-black mt-1">
//                 <button
//                   className="text-blue-600 hover:underline"
//                   onClick={() => handleMarkRead(n._id || n.id)}
//                 >
//                   Mark read
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }




'use client';
import { useState } from 'react';
import { useNotificationsQuery, useMarkNotificationReadMutation } from '../src/redux/api';

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: notifications = [] } = useNotificationsQuery();
  const [mark] = useMarkNotificationReadMutation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id) => {
    try {
      await mark(id).unwrap();
      // mark mutation invalidates Notification tag (your api already does)
      // the provider's update/invalidate will refresh list
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 right-3 text-xs bg-red-600 text-white rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 bg-white border rounded shadow-lg overflow-y-auto z-50">
          {notifications.length === 0 && (
            <div className="text-sm text-gray-500 p-2">No notifications</div>
          )}
          {notifications.map(n => (
            <div
              key={n._id || n.id}
              onClick={() => handleMarkRead(n._id || n.id)}
              className={`p-3 border-b cursor-pointer flex items-start gap-2 text-sm ${
                !n.read ? 'bg-gray-100 font-medium' : 'bg-white text-gray-700'
              } hover:bg-gray-200 transition-colors`}
            >
              {!n.read && (
                <span className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              )}
              <div className="flex-1">
                <div className="text-gray-800">{n.comment || 'No message'}</div>
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
