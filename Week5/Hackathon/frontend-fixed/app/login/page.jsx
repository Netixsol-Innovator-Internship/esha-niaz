'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useLoginMutation } from '../../src/redux/api';
import { toast } from '../../components/Toaster';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [login, { isLoading }] = useLoginMutation();
  const set = (k,v) => setForm(s=>({...s,[k]:v}));
  const submit = async (e) => {
    e.preventDefault();
    try { await login(form).unwrap(); toast('Logged in'); router.push('/'); } catch (err) { toast(err?.data?.message || 'Login failed'); }
  };
  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <form onSubmit={submit} className="space-y-4">
          <div><label>Username</label><input className="input" value={form.username} onChange={(e)=>set('username',e.target.value)} required /></div>
          <div><label>Password</label><input className="input" type="password" value={form.password} onChange={(e)=>set('password',e.target.value)} required /></div>
          <button disabled={isLoading} className="btn btn-primary w-full">{isLoading ? 'Logging...' : 'Login'}</button>
        </form>
        <div className="text-sm mt-4">New? <Link href="/signup">Create account</Link></div>
      </div>
    </div>
  );
}
