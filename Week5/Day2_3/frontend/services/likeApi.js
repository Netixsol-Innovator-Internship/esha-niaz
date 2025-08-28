'use client';
import { baseApi } from './baseApi';

export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    likeComment: builder.mutation({
      query: ({commentId}) => ({ url: '/likes', method: 'POST', body: { commentId } }),
      invalidatesTags: (_r,_e,arg)=> ['Likes', {type:'LikeStatus', id: arg.commentId}, 'Comments'],
    }),
    unlikeComment: builder.mutation({
      query: (commentId) => ({ url: `/likes/${commentId}`, method: 'DELETE' }),
      invalidatesTags: (_r,_e,commentId)=> ['Likes', {type:'LikeStatus', id: commentId}, 'Comments'],
    }),
    getCommentLikes: builder.query({
      query: ({commentId,page=1,limit=10}) => ({ url: `/likes/comment/${commentId}?page=${page}&limit=${limit}` }),
      providesTags: ['Likes'],
    }),
    getUserLikes: builder.query({
      query: ({userId,page=1,limit=10}) => ({ url: `/likes/user/${userId}?page=${page}&limit=${limit}` }),
      providesTags: ['Likes'],
    }),
    getLikeStatus: builder.query({
      query: (commentId) => ({ url: `/likes/status/${commentId}` }),
      providesTags: (_r,_e,commentId)=> [{type:'LikeStatus', id: commentId}],
    }),
  }),
});

export const {
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useGetCommentLikesQuery,
  useGetUserLikesQuery,
  useGetLikeStatusQuery,
} = likeApi;
