
'use client';
import { useGetMeQuery } from '../lib/services/api';
import Link from 'next/link';
import Hero from '../components/Hero';
import Products from '../components/Products';


export default function Home() {
  const { data: me, isLoading } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });

  return (
    <>
    {/* <div className="stack">
      <h1>Welcome{me?.fullName ? `, ${me.fullName}` : ''}</h1>
      <p className="small">This is the public home page. Use the navigation to login or sign up.</p>
      {isLoading && <p className="small">Loading session…</p>}
      {me && (
        <div className="card">
          <div className="row">
            <div><b>Email:</b> {me.email}</div>
            <div><b>Role:</b> {me.role}</div>
            <div><b>Verified:</b> {String(me.verified)}</div>
          </div>
          {(me.role === 'admin' || me.role === 'superadmin') && (
            <Link className="btn" href={me.role === 'admin' ? '/dashboard/admin' : '/dashboard/superadmin'}>
              Go to Dashboard
            </Link>
          )}
        </div>
      )}
    </div> */}
    <div className="w-full justify-center content-center">
          <Hero />
          <Products />
    </div>
 
    </>
  );
}
