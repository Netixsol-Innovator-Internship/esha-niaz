'use client';
import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth','User'],
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth','User'],
    }),
    getProfile: builder.query({
      query: () => ({ url: '/auth/profile' }),
      providesTags: ['User'],
    }),
    verifyToken: builder.query({
      query: () => ({ url: '/auth/verify' }),
      providesTags: ['Auth'],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetProfileQuery, useVerifyTokenQuery } = authApi;
