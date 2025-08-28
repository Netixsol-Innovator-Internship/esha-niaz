'use client';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../services/notificationApi';
import { useEffect, useState } from 'react';
import { useSocket } from './SocketProvider';
import Image from 'next/image';

export default function Header(){
  const { token, user } = useSelector(s=>s.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useGetNotificationsQuery({page:1, limit:20}, { skip: !token });
  const [markAll] = useMarkAllAsReadMutation();
  const { unread } = useSocket();

  useEffect(()=>{ if (open) refetch(); }, [open]);

  return (
    <header className="header">
      <div className="row" style={{margin:0}}>
        <Link href="/">🏠</Link>
        <Link href="/comments">Comments</Link>
        {token && <Link href="/profile">My Profile</Link>}
        {token && <Link href="/users">Users</Link>}
      </div>
      <div className="header-right">
        {token && (
          <div style={{position:'relative'}}>
            <button onClick={()=>setOpen(v=>!v)}>🔔 {unread>0 && <span className="badge">{unread}</span>}</button>
            <div className="card" style={{position:'absolute', right:0, top:44, width:360, display: open ? 'block':'none'}}>
              <div className="row" style={{justifyContent:'space-between'}}>
                <b>Notifications</b>
                <button onClick={()=> markAll().then(()=>refetch())}>Mark all read</button>
              </div>
              <div className="list" style={{maxHeight:300, overflow:'auto'}}>
                {data?.notifications?.length ? data.notifications.map(n=>(
                  <div key={n.id} className="card-inline">
                    <div style={{fontSize:13}}>{n.message}</div>
                    <div className="meta">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                )) : <div className="meta">No notifications</div>}
              </div>
            </div>
          </div>
        )}
        {token ? (
          <>
            <div className="row" style={{margin:0, alignItems:'center'}}>
              <Image alt="avatar" width={36} height={36} className="avatar" src={user?.profilePicture ? `${process.env.NEXT_PUBLIC_WS_URL}${user.profilePicture}` : '/placeholder.svg'} />
              <span style={{fontSize:14}}>@{user?.username}</span>
            </div>
            <button onClick={()=>dispatch(logout())}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Sign up</Link>
          </>
        )}
      </div>
    </header>
  );
}
