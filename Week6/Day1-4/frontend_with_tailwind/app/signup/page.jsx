
// 'use client';
// import { useState } from 'react';
// import { useSignupMutation } from '../../lib/services/api';
// import { useRouter } from 'next/navigation';

// export default function Signup(){
//   const [form, setForm] = useState({ username:'', email:'', fullName:'', password:'' });
//   const [signup, { isLoading, error, data }] = useSignupMutation();
//   const router = useRouter();

//   const submit = async (e) => {
//     e.preventDefault();
//     const res = await signup(form);
//     if (!('error' in res)) {
//       // Go to OTP verification screen
//       router.push(`/verify-otp?email=${encodeURIComponent(form.email)}&purpose=verify_email`);
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Create account</h2>
//       <form className="stack" onSubmit={submit}>
//         <div className="stack">
//           <label>Username</label>
//           <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
//         </div>
//         <div className="stack">
//           <label>Email</label>
//           <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
//         </div>
//         <div className="stack">
//           <label>Full name</label>
//           <input value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})} required />
//         </div>
//         <div className="stack">
//           <label>Password</label>
//           <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
//           <span className="small">Min 8 chars, must include letters & numbers.</span>
//         </div>
//         {data?.message && <div className="alert success">{data.message}</div>}
//         {error && <div className="alert error">{'data' in error ? error.data?.message || 'Signup failed' : 'Signup failed'}</div>}
//         <button className="btn" disabled={isLoading}>{isLoading ? 'Creating…' : 'Sign up'}</button>
//       </form>
//       <p className="small">Already have an account? <a href="/login">Login</a></p>
//     </div>
//   )
// }





'use client';
import { useState } from 'react';
import { useSignupMutation } from '../../lib/services/api';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [form, setForm] = useState({ username:'', email:'', fullName:'', password:'' });
  const [signup, { isLoading, error, data }] = useSignupMutation();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const res = await signup(form);
    if (!('error' in res)) {
      router.push(`/verify-otp?email=${encodeURIComponent(form.email)}&purpose=verify_email`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create account</h2>
        <form className="space-y-4" onSubmit={submit}>
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              value={form.username}
              onChange={e=>setForm({...form, username:e.target.value})}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e=>setForm({...form, email:e.target.value})}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Full name</label>
            <input
              value={form.fullName}
              onChange={e=>setForm({...form, fullName:e.target.value})}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={e=>setForm({...form, password:e.target.value})}
              required
              className="input"
            />
            <span className="text-xs text-gray-500">Min 8 chars, must include letters & numbers.</span>
          </div>
          {data?.message && <div className="text-green-600 text-sm">{data.message}</div>}
          {error && (
            <div className="text-red-500 text-sm">
              {'data' in error ? error.data?.message || 'Signup failed' : 'Signup failed'}
            </div>
          )}
          <button className="btn btn-black w-full" disabled={isLoading}>
            {isLoading ? 'Creating…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="link">Login</a>
        </p>
      </div>
    </div>
  );
}
