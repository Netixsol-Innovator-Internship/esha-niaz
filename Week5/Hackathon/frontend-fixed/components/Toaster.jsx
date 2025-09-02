'use client';
import { useEffect, useState } from 'react';

export default function Toaster() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    const handler = (e) => { setMsg(e.detail); setTimeout(()=>setMsg(null), 2500); };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, []);
  if (!msg) return null;
  return <div className="fixed top-4 right-4 z-50"><div className="bg-gray-900 text-white px-4 py-2 rounded">{msg}</div></div>;
}
export const toast = (text) => { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('toast', { detail: text })); };
