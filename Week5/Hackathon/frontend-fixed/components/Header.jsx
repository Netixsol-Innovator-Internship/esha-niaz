// 'use client';
// import Link from 'next/link';
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { hydrateFromStorage, logout } from '../src/redux/slices/authSlice';
// import NotificationBell from './NotificationBell';
// import { useRouter } from 'next/navigation';
// export default function Header() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   useEffect(() => { dispatch(hydrateFromStorage()); }, [dispatch]);
//   const { user } = useSelector(s => s.auth || {});
//     const handleLogout = () => {
//     dispatch(logout());
//     router.push('/'); // Redirect to home after logout
//   };

//   return (
//     <header className="w-full">
//       <div className="bg-blue-900 text-white text-xs">
//         <div className="container flex items-center justify-between py-2">
//           <div>Call: +92 000 000000</div>
//           <div className="flex items-center gap-3">
//             {user ? (
//               <>
//                 <NotificationBell />
//                 <Link href="/profile">Hi, {user.fullName || user.username}</Link>
//                 {/* <button onClick={() => dispatch(logout())}>Logout</button> */}
//                 <button onClick={handleLogout}>Logout</button>
//               </>
//             ) : (
//               <>
//                 <Link href="/login">Login</Link>
//                 <Link href="/signup">Sign Up</Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="bg-white border-b">
//         <div className="container flex items-center justify-between py-4">
//           <Link href="/" className="text-2xl font-bold">CarBid</Link>
//           <nav className="flex items-center gap-6 text-sm">
//             <Link href="/">Home</Link>
//             <Link href="/live-auctions">Live Auction</Link>
//             <Link href="/profile">My Profile</Link>
//           </nav>
//         </div>
//       </div>
//     </header>
//   );
// }



'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hydrateFromStorage, logout } from '../src/redux/slices/authSlice';
import NotificationBell from './NotificationBell';
import { useRouter } from 'next/navigation';
import { api } from '../src/redux/api';
export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  const { user } = useSelector((s) => s.auth || {});

  const handleLogout = () => {
    dispatch(logout());
    dispatch(api.util.resetApiState()); // ✅ clear RTK Query cache
    router.push('/');
  };

  const handleProfileClick = (e) => {
    if (!user) {
      e.preventDefault(); // prevent the default Link behavior
      router.push('/login'); // redirect to login
    }
  };

  return (
    <header className="w-full">
      <div className="bg-blue-900 text-white text-xs">
        <div className="container flex items-center justify-between py-2">
          <div>Call: +92 000 000000</div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <NotificationBell />
                <Link href="/profile">Hi, {user.fullName || user.username}</Link>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/signup">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white border-b">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-2xl font-bold">CarBid</Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/">Home</Link>
            <Link href="/live-auctions">Live Auction</Link>
            <Link href="/profile" onClick={handleProfileClick}>My Profile</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
