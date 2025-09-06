
// 'use client';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { useVerifyOtpMutation, useResendOtpMutation } from '../../lib/services/api';

// export default function VerifyOtp(){
//   const params = useSearchParams();
//   const emailParam = params.get('email') || '';
//   const purposeParam = params.get('purpose') || 'verify_email';

//   const [email, setEmail] = useState(emailParam);
//   const [code, setCode] = useState('');
//   const [purpose, setPurpose] = useState(purposeParam);
//   const [verify, { isLoading, error, data }] = useVerifyOtpMutation();
//   const [resend, { isLoading: isResending }] = useResendOtpMutation();
//   const router = useRouter();

//   const submit = async (e) => {
//     e.preventDefault();
//     const res = await verify({ email, code, purpose });
//     if (!('error' in res)) {
//       if (purpose === 'verify_email') router.replace('/login');
//       else router.replace('/reset-password?email=' + encodeURIComponent(email));
//     }
//   };

//   const resendOtp = async () => {
//     await resend({ email, purpose });
//   };

//   return (
//     <div className="card">
//       <h2>Verify OTP</h2>
//       <form className="stack" onSubmit={submit}>
//         <div className="stack">
//           <label>Email</label>
//           <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
//         </div>
//         <div className="stack">
//           <label>Code</label>
//           <input value={code} onChange={e=>setCode(e.target.value)} required />
//         </div>
//         <div className="stack">
//           <label>Purpose</label>
//           <select value={purpose} onChange={e=>setPurpose(e.target.value)}>
//             <option value="verify_email">verify_email</option>
//             <option value="reset_password">reset_password</option>
//           </select>
//         </div>
//         {data?.message && <div className="alert success">{data.message}</div>}
//         {error && <div className="alert error">{'data' in error ? error.data?.message || 'Failed' : 'Failed'}</div>}
//         <div className="row">
//           <button className="btn" disabled={isLoading}>{isLoading ? 'Verifying…' : 'Verify'}</button>
//           <button type="button" className="btn secondary" onClick={resendOtp} disabled={isResending}>{isResending ? 'Resending…' : 'Resend OTP'}</button>
//         </div>
//       </form>
//     </div>
//   )
// }





'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useVerifyOtpMutation, useResendOtpMutation } from '../../lib/services/api';

export default function VerifyOtp() {
  const params = useSearchParams();
  const emailParam = params.get('email') || '';
  const purposeParam = params.get('purpose') || 'verify_email';

  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState('');
  const [purpose, setPurpose] = useState(purposeParam);
  const [verify, { isLoading, error, data }] = useVerifyOtpMutation();
  const [resend, { isLoading: isResending }] = useResendOtpMutation();
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();
    const res = await verify({ email, code, purpose });
    if (!('error' in res)) {
      if (purpose === 'verify_email') router.replace('/login');
      else router.replace('/reset-password?email=' + encodeURIComponent(email));
    }
  };

  const resendOtp = async () => {
    await resend({ email, purpose });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
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
            <label className="block mb-1 text-sm font-medium">Code</label>
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Purpose</label>
            <select
              value={purpose}
              onChange={e => setPurpose(e.target.value)}
              className="input"
            >
              <option value="verify_email">verify_email</option>
              <option value="reset_password">reset_password</option>
            </select>
          </div>
          {data?.message && <div className="text-green-600 text-sm">{data.message}</div>}
          {error && <div className="text-red-500 text-sm">{'data' in error ? error.data?.message || 'Failed' : 'Failed'}</div>}
          <div className="flex gap-3">
            <button className="btn btn-black flex-1" disabled={isLoading}>
              {isLoading ? 'Verifying…' : 'Verify'}
            </button>
            <button
              type="button"
              className="btn btn-light flex-1"
              onClick={resendOtp}
              disabled={isResending}
            >
              {isResending ? 'Resending…' : 'Resend OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
