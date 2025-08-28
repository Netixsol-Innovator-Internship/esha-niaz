'use client';
import { useRegisterMutation } from '../../services/authApi';
import { setCredentials } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage(){
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get('username');
    const email = form.get('email');
    const password = form.get('password');
    try{
      const res = await register({ username, email, password }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      toast.success('Registered!');
      router.push('/comments');
    }catch(err){
      toast.error(err?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="center-screen">
      <form className="card" onSubmit={onSubmit} style={{minWidth:360}}>
        <h2>Sign Up</h2>
        <input name="username" placeholder="Username" required minLength={3}/>
        <input name="email" type="email" placeholder="Email" required/>
        <input name="password" type="password" placeholder="Password" required minLength={6}/>
        <button className="primary" disabled={isLoading}>{isLoading? 'Please wait':'Create account'}</button>
        <div className="meta">Already have an account? <a href="/login">Login</a></div>
      </form>
    </div>
  );
}
