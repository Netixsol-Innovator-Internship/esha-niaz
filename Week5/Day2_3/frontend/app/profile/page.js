'use client';
import { useGetProfileQuery } from '../../services/authApi';
import { useUpdateProfileMutation, useUploadProfilePictureMutation } from '../../services/userApi';
import { useGetUserFollowersQuery, useGetUserFollowingQuery } from '../../services/followerApi';
import { useGetUserLikesQuery } from '../../services/likeApi';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../../slices/authSlice';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProfilePage(){
  const auth = useSelector(s=>s.auth);
  const { data: profile, refetch } = useGetProfileQuery(undefined, { skip: !auth?.token });
  const userId = profile?.user?.id || auth?.user?.id || auth?.user?._id;
  const { data: followers } = useGetUserFollowersQuery({ userId, page:1, limit:10 }, { skip: !userId });
  const { data: following } = useGetUserFollowingQuery({ userId, page:1, limit:10 }, { skip: !userId });
  const { data: likes } = useGetUserLikesQuery({ userId, page:1, limit:10 }, { skip: !userId });

  const [updateProfile] = useUpdateProfileMutation();
  const [uploadPic] = useUploadProfilePictureMutation();
  const dispatch = useDispatch();

  const onSave = async (e)=>{
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const bio = fd.get('bio');
    try{
      const res = await updateProfile({ bio }).unwrap();
      toast.success('Profile updated');
      dispatch(setCredentials({ token: auth.token, user: res.user }));
      refetch();
    }catch(e){ toast.error(e?.data?.message || 'Failed'); }
  };

  const onUpload = async (e)=>{
    const file = e.target.files?.[0];
    if (!file) return;
    try{
      const res = await uploadPic(file).unwrap();
      toast.success('Profile picture updated');
      dispatch(setCredentials({ token: auth.token, user: res.user }));
      refetch();
    }catch(e){ toast.error(e?.data?.message || 'Upload failed'); }
  };

  if (!auth?.token) return <div className="meta">Please login</div>;

  const user = profile?.user || auth?.user || {};
  const avatarSrc = user?.profilePicture ? `${process.env.NEXT_PUBLIC_WS_URL}${user.profilePicture}` : '/placeholder.svg';

  return (
    <div className="profile-grid">
      <div className="card">
        <div style={{display:'grid', placeItems:'center'}}>
          <Image src={avatarSrc} alt="avatar" width={160} height={160} className="avatar" style={{width:160, height:160, borderRadius:12}}/>
        </div>
        <input type="file" onChange={onUpload} accept="image/*"/>
        <div><b>@{user.username}</b></div>
        <div className="meta">{user.email}</div>
        <div className="row">
          <div className="badge">Followers: {followers?.total || 0}</div>
          <div className="badge">Following: {following?.total || 0}</div>
          

        </div>
      </div>

      <div className="card">
        <h2>About</h2>
        <form onSubmit={onSave}>
          <textarea name="bio" defaultValue={user.bio || ''} placeholder="Write your bio..."/>
          <button className="primary">Save</button>
        </form>
        
        <h3 style={{marginTop:16}}>Recent Likes</h3>
        <div className="list">
          {likes?.likes?.length ? likes.likes.map(l=>(
            <div key={l.id} className="card-inline">
              <div>Liked comment ID: <b>{l?.commentId || l?.id}</b></div>
              <div className="meta">{new Date(l.createdAt).toLocaleString()}</div>
            </div>
          )) : <div className="meta">No likes yet</div>}
        </div>
      </div>
    </div>
  );
}
