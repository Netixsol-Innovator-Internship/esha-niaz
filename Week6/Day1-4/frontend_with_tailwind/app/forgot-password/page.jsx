'use client';
import { useState } from 'react';
import { useForgotPasswordMutation } from '../../lib/services/api';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [forgot, { isLoading, error, data }] = useForgotPasswordMutation();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const res = await forgot({ email });
    if (!('error' in res)) {
      router.push(`/verify-otp?email=${encodeURIComponent(email)}&purpose=reset_password`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot password</h2>
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
          {data?.message && <div className="text-green-600 text-sm">{data.message}</div>}
          {error && <div className="text-red-500 text-sm">{'data' in error ? error.data?.message || 'Failed' : 'Failed'}</div>}
          <button className="btn btn-black w-full" disabled={isLoading}>
            {isLoading ? 'Sending…' : 'Send reset OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}
