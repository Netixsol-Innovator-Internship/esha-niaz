'use client';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();
  return (
    <div className="center-screen">
      <div className="card">
        <h1>Welcome to Real-time Comments</h1>
        <p>Sign up or log in to start commenting and get live notifications.</p>
        <div className="row">
          <button onClick={() => router.push('/register')}>Sign Up</button>
          <button onClick={() => router.push('/login')}>Log In</button>
        </div>
        <button className="primary" onClick={() => router.push('/login')}>
          Get Started
        </button>
      </div>
    </div>
  );
}
