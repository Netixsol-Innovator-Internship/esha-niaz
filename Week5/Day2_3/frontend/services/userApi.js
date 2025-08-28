'use client';
import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => ({ url: `/users/${id}` }),
      providesTags: (_r,_e,id)=> [{type:'User', id}],
    }),
    getUserByUsername: builder.query({
      query: (username) => ({ url: `/users/username/${username}` }),
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: '/users/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    uploadProfilePicture: builder.mutation({
      query: (file) => {
        const form = new FormData();
        form.append('profilePicture', file);
        return {
          url: '/users/profile/upload',
          method: 'POST',
          body: form,
        };
      },
      invalidatesTags: ['User'],
    }),
    getAllUsers: builder.query({
      query: ({page=1,limit=10}={}) => ({
        url: `/users?page=${page}&limit=${limit}`
      }),
      providesTags: ['Users'],
    }),
    searchUsers: builder.query({
      query: ({ query, limit=5 }) => ({
        url: `/users/search/${encodeURIComponent(query)}?limit=${limit}`,
      }),
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useGetUserByUsernameQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
  useGetAllUsersQuery,
  useSearchUsersQuery
} = userApi;
