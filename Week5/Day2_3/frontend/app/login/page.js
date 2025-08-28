'use client';
import { useLoginMutation } from '../../services/authApi';
import { setCredentials } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage(){
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const usernameOrEmail = form.get('usernameOrEmail');
    const password = form.get('password');
    try{
      const res = await login({ usernameOrEmail, password }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      toast.success('Logged in!');
      router.push('/comments');
    }catch(err){
      toast.error(err?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="center-screen">
      <form className="card" onSubmit={onSubmit} style={{minWidth:360}}>
        <h2>Login</h2>
        <input name="usernameOrEmail" placeholder="Username or email" required/>
        <input name="password" type="password" placeholder="Password" required/>
        <button className="primary" disabled={isLoading}>{isLoading? 'Please wait':'Login'}</button>
        <div className="meta">No account? <a href="/register">Sign up</a></div>
      </form>
    </div>
  );
}
