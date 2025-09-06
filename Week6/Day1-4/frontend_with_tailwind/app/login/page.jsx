
// 'use client';
// import { useState, useEffect } from 'react';
// import { useLoginMutation, useGetMeQuery } from '../../lib/services/api';
// import { setToken } from '../../lib/slices/authSlice';
// import { useDispatch } from 'react-redux';
// import { useRouter } from 'next/navigation';

// export default function Login(){
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [login, { isLoading, error, data }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { data: me } = useGetMeQuery(undefined, { skip: true });

//   useEffect(() => {
//     if (data?.accessToken) {
//       dispatch(setToken(data.accessToken));
//       // fetch /users/me then route based on role
//       (async () => {
//         try{
//           const res = await fetch((process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000') + '/users/me', {
//             headers: { 'Authorization': 'Bearer ' + data.accessToken }
//           });
//           const me = await res.json();
//           if (me?.role === 'admin') router.replace('/dashboard/admin');
//           else if (me?.role === 'superadmin') router.replace('/dashboard/superadmin');
//           else router.replace('/');
//         } catch(e){
//           router.replace('/');
//         }
//       })();
//     }
//   }, [data]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     await login({ email, password });
//   };

//   return (
//     <div className="card">
//       <h2>Login</h2>
//       <form className="stack" onSubmit={onSubmit}>
//         <div className="stack">
//           <label>Email</label>
//           <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
//         </div>
//         <div className="stack">
//           <label>Password</label>
//           <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
//         </div>
//         {error && <div className="alert error">{'data' in error ? error.data?.message || 'Login failed' : 'Login failed'}</div>}
//         <button className="btn" disabled={isLoading}>{isLoading ? 'Logging in…' : 'Login'}</button>
//       </form>
//       <p className="small">No account? <a href="/signup">Sign up</a></p>
//     </div>
//   )
// }




'use client';
import { useState, useEffect } from 'react';
import { useLoginMutation } from '../../lib/services/api';
import { setToken } from '../../lib/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error, data }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (data?.accessToken) {
      dispatch(setToken(data.accessToken));
      router.replace('/');
    }
  }, [data]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="card w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              value={email}
              onChange={e=>setEmail(e.target.value)}
              type="email"
              required
              className="input"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              value={password}
              onChange={e=>setPassword(e.target.value)}
              type="password"
              required
              className="input"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">
              {'data' in error ? error.data?.message || 'Login failed' : 'Login failed'}
            </div>
          )}
          <button className="btn btn-black w-full" disabled={isLoading}>
            {isLoading ? 'Logging in…' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          No account? <a href="/signup" className="link">Sign up</a>
        </p>
      </div>
    </div>
  );
}
