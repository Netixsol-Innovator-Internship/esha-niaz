'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRegisterMutation } from '../../src/redux/api';
import { toast } from '../../components/Toaster';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username:'', fullName:'', phone:'', email:'', password:'' });
  const [registerUser, { isLoading }] = useRegisterMutation();
  const set = (k,v) => setForm(s=>({...s,[k]:v}));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form).unwrap();
      toast('Account created');
      router.push('/login');
    } catch (err) {
      toast(err?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-md mx-auto card p-6">
        <h1 className="text-2xl font-semibold mb-1">Create account</h1>
        <form onSubmit={submit} className="space-y-4">
          <div><label>Username</label><input className="input" value={form.username} onChange={(e)=>set('username',e.target.value)} required /></div>
          <div><label>Full Name</label><input className="input" value={form.fullName} onChange={(e)=>set('fullName',e.target.value)} required /></div>
          <div><label>Phone</label><input className="input" value={form.phone} onChange={(e)=>set('phone',e.target.value)} required /></div>
          <div><label>Email</label><input className="input" type="email" value={form.email} onChange={(e)=>set('email',e.target.value)} required /></div>
          <div><label>Password</label><input className="input" type="password" value={form.password} onChange={(e)=>set('password',e.target.value)} required /></div>
          <button disabled={isLoading} className="btn btn-primary w-full">{isLoading ? 'Creating...' : 'Sign Up'}</button>
        </form>
        <div className="text-sm mt-4">Already have account? <Link href="/login">Login</Link></div>
      </div>
    </div>
  );
}
