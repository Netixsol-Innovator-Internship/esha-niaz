'use client';
import { baseApi } from './baseApi';

export const followerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    followUser: builder.mutation({
      query: (userId) => ({ url: '/followers/follow', method: 'POST', body: { userId } }),
      invalidatesTags: (_r,_e,userId)=> ['Followers','Following', {type:'FollowStatus', id:userId}],
    }),
    unfollowUser: builder.mutation({
      query: (userId) => ({ url: `/followers/unfollow/${userId}`, method: 'DELETE' }),
      invalidatesTags: (_r,_e,userId)=> ['Followers','Following', {type:'FollowStatus', id:userId}],
    }),
    getUserFollowers: builder.query({
      query: ({userId,page=1,limit=10}) => ({ url: `/followers/${userId}/followers?page=${page}&limit=${limit}` }),
      providesTags: ['Followers'],
    }),
    getUserFollowing: builder.query({
      query: ({userId,page=1,limit=10}) => ({ url: `/followers/${userId}/following?page=${page}&limit=${limit}` }),
      providesTags: ['Following'],
    }),
    isFollowing: builder.query({
      query: (userId) => ({ url: `/followers/is-following/${userId}` }),
      providesTags: (_r,_e,userId)=> [{type:'FollowStatus', id:userId}],
    }),
  }),
});

export const {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
  useIsFollowingQuery
} = followerApi;
