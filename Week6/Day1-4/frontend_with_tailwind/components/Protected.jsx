
'use client';
import { useGetMeQuery } from '../lib/services/api';
import { useRouter } from 'next/navigation';

export default function Protected({ children, allow=['user','admin','superadmin'] }){
  const router = useRouter();
  const { data: me, isLoading, isError } = useGetMeQuery();

  if (isLoading) return <p className="small">Checking session…</p>;
  if (isError || !me) {
    if (typeof window !== 'undefined') router.replace('/login');
    return null;
  }
  if (!allow.includes(me.role)) {
    if (typeof window !== 'undefined') router.replace('/');
    return null;
  }
  return children;
}
