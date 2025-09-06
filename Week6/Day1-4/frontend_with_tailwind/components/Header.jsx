
'use client';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { selectAuth, logout } from '../lib/slices/authSlice';
import CartPopup from './CartPopup'; // ✅ make sure the path is correct
import NotificationBell from './NotificationBell'; // ✅ make sure the path is correct

export default function Header() {
  const { token, me } = useSelector(selectAuth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);

  const handleCartClick = () => {
    if (!token) {
      router.push('/login'); // redirect to login if not logged in
    } else {
      setCartOpen((prev) => !prev); // toggle cart popup
    }
  };

    const handleLogout = () => {
    dispatch(logout());
    router.push("/"); // Redirects to main page
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="container-max flex items-center justify-between py-4 gap-6">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-wide">
          SHOP.CO
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-gray-600">Shop</Link>
          <Link href="/" className="hover:text-gray-600">On Sale</Link>
          <Link href="/" className="hover:text-gray-600">New Arrivals</Link>
          <Link href="/" className="hover:text-gray-600">Brands</Link>

          {/* 👤 Show My Profile if logged in */}
          {token && (
            <Link href="/profile" className="hover:text-gray-600">
              My Profile
            </Link>
          )}

            {/* 📦 Show My Orders if logged in */}
  {token && (
    <Link href="/order" className="hover:text-gray-600">
      My Orders
    </Link>
  )}

          {/* 🛠️ Show Dashboard if Admin or SuperAdmin */}
          {token && (me?.role === 'admin' || me?.role === 'superadmin') && (
            <Link href="/dashboard" className="hover:text-gray-600">
              Dashboard
            </Link>
          )}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-xl hidden md:flex">
          <div className="flex w-full items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
            <svg className="w-5 h-5 text-gray-500"><use href="/icons.svg#search" /></svg>
            <input
              className="bg-transparent outline-none w-full text-sm"
              placeholder="Search for products..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleCartClick}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Cart"
          >
            <svg className="w-6 h-6"><use href="/icons.svg#cart" /></svg>
          </button>
                   {/* ✅ Show notification bell only when logged in */}
          {token && <NotificationBell />}

          {token ? (
            <>
              <span className="hidden md:inline text-sm text-gray-600">
                {me?.email} ({me?.role})
              </span>
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-sm font-medium bg-black text-white rounded-full hover:bg-black/90"
    >
      Logout
    </button>
            </>
          ) : (
            <Link
              href="/login"
              className="p-2 hover:bg-gray-100 rounded-full"
              aria-label="Account"
            >
              <svg className="w-6 h-6"><use href="/icons.svg#user" /></svg>
            </Link>
          )}
        </div>
      </div>

      {/* Cart Popup */}
      {cartOpen && (
        <CartPopup open={cartOpen} onClose={() => setCartOpen(false)} />
      )}
    </header>
  );
}
