'use client';
import Link from 'next/link';
import { useGetAllUsersQuery } from '../../services/userApi';
import { useSelector } from 'react-redux';

export default function UsersPage(){
  const { token } = useSelector(s=>s.auth);
  const { data } = useGetAllUsersQuery({ page:1, limit:20 }, { skip: !token });
  if (!token) return <div className="meta">Please login</div>;
  const users = data?.users || [];
  return (
    <div className="card">
      <h2>Users</h2>
      <table>
        <thead><tr><th>Username</th><th>Email</th><th>Profile</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}>
              <td>@{u.username}</td>
              <td>{u.email}</td>
              <td><Link href={`/users/${u.id}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
