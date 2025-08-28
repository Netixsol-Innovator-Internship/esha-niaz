'use client';
import { useParams } from 'next/navigation';
import { useGetUserByIdQuery } from '../../../services/userApi';
import { useFollowUserMutation, useUnfollowUserMutation, useIsFollowingQuery, useGetUserFollowersQuery, useGetUserFollowingQuery } from '../../../services/followerApi';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

export default function UserProfile(){
  const { id } = useParams();
  const { token, user: self } = useSelector(s=>s.auth);
  const { data } = useGetUserByIdQuery(id, { skip: !token });
  const profile = data?.user;
  const { data: followers } = useGetUserFollowersQuery({ userId: id, page:1, limit:10 }, { skip: !token });
  const { data: following } = useGetUserFollowingQuery({ userId: id, page:1, limit:10 }, { skip: !token });
  const { data: followStatus, refetch } = useIsFollowingQuery(id, { skip: !token });
  const [follow] = useFollowUserMutation();
  const [unfollow] = useUnfollowUserMutation();

  if (!token) return <div className="meta">Please login</div>;
  if (!profile) return <div className="meta">Loading...</div>;
  const avatarSrc = profile?.profilePicture ? `${process.env.NEXT_PUBLIC_WS_URL}${profile.profilePicture}` : '/placeholder.svg';
  const isSelf = self?.id === id || self?._id === id;
  const isFollowing = followStatus?.isFollowing;

  const toggleFollow = async ()=>{
    try{
      if (isFollowing) { await unfollow(id).unwrap(); toast('Unfollowed'); }
      else { await follow(id).unwrap(); toast('Followed'); }
      refetch();
    }catch(e){ toast.error(e?.data?.message || 'Failed'); }
  };

  return (
    <div className="profile-grid">
      <div className="card">
        <Image src={avatarSrc} alt="avatar" width={160} height={160} className="avatar" style={{width:160, height:160, borderRadius:12}}/>
        <div><b>@{profile.username}</b></div>
        <div className="meta">{profile.email}</div>
        <div className="row">
          <div className="badge">Followers: {followers?.total || 0}</div>
          <div className="badge">Following: {following?.total || 0}</div>
        </div>
        {!isSelf && (
          <button className="primary" onClick={toggleFollow}>
            {isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        )}
      </div>
      <div className="card">
        <h2>Bio</h2>
        <p>{profile.bio || 'No bio yet'}</p>
      </div>
    </div>
  );
}
