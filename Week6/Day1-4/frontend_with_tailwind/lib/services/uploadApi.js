'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// ⚡ Special baseQuery for file uploads (no JSON content-type)
const baseQueryForUpload = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    // ❌ Do NOT set content-type, browser will auto-set it for FormData
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQueryForUpload(args, api, extraOptions);
  if (result?.error && (result.error.status === 401 || result.error.status === 403)) {
    api.dispatch(logout());
  }
  return result;
};

export const uploadApi = createApi({
  reducerPath: 'uploadApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Products'], // so product refetch still works
  endpoints: (builder) => ({
    uploadImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}/upload-image`,
        method: 'POST',
        body: formData, // must be FormData
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
