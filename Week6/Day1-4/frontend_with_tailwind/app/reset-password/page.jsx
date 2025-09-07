'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useResetPasswordMutation } from '../../lib/services/api';

export default function ResetPassword() {
  const params = useSearchParams();
  const emailParam = params.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [tokenOrCode, setTokenOrCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reset, { isLoading, error, data }] = useResetPasswordMutation();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const res = await reset({ email, tokenOrCode, newPassword });
    if (!('error' in res)) router.replace('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset password</h2>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">OTP Code</label>
            <input
              value={tokenOrCode}
              onChange={e => setTokenOrCode(e.target.value)}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          {data?.message && <div className="text-green-600 text-sm">{data.message}</div>}
          {error && <div className="text-red-500 text-sm">{'data' in error ? error.data?.message || 'Failed' : 'Failed'}</div>}
          <button className="btn btn-black w-full" disabled={isLoading}>
            {isLoading ? 'Resetting…' : 'Reset password'}
          </button>
        </form>
      </div>
    </div>
  );
}
