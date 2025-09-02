'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { endpoints } from '../utils/endpoints';
import { setCredentials, logout } from './slices/authSlice';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  credentials: process.env.NEXT_PUBLIC_AUTH_USE_COOKIES === 'true' ? 'include' : 'same-origin',
  prepareHeaders: (headers, { getState }) => {
    const state = getState();
    const token = state?.auth?.token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: async (args, apiCtx, extra) => {
    const result = await baseQuery(args, apiCtx, extra);
    if (result?.error && [401, 403].includes(result.error.status)) {
      apiCtx.dispatch(logout());
    }
    return result;
  },
  tagTypes: ['Me', 'Auction', 'Bid', 'Car', 'Notification'],
  endpoints: (builder) => ({
    // Auth
    login: builder.mutation({
      query: (body) => ({ url: endpoints.login, method: 'POST', body }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
    }),
    register: builder.mutation({
      query: (body) => ({ url: endpoints.register, method: 'POST', body }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {}
      },
    }),

    // Me
    me: builder.query({ query: () => ({ url: endpoints.me, method: 'GET' }), providesTags: ['Me'] }),
    updateMe: builder.mutation({ query: (body) => ({ url: endpoints.updateMe, method: 'PUT', body }), invalidatesTags: ['Me'] }),

    // Cars / Auctions
    liveAuctions: builder.query({ query: (params) => ({ url: endpoints.liveAuctions, method: 'GET', params }), providesTags: ['Auction'] }),
    auctionById: builder.query({ query: (id) => ({ url: endpoints.carById(id), method: 'GET' }), providesTags: (res, err, id) => [{ type: 'Auction', id }] }),
    myCars: builder.query({ query: () => ({ url: endpoints.myCars, method: 'GET' }), providesTags: ['Car'] }),
    endAuction: builder.mutation({ query: (id) => ({ url: endpoints.endAuction(id), method: 'POST' }), invalidatesTags: ['Auction'] }),

    // Bids
    bidsForAuction: builder.query({ query: (carId) => ({ url: endpoints.bidsForCar(carId), method: 'GET' }), providesTags: (res, err, id) => [{ type: 'Bid', id }] }),
    myBids: builder.query({ query: () => ({ url: endpoints.myBids, method: 'GET' }), providesTags: ['Bid'] }),
    placeBid: builder.mutation({ query: (body) => ({ url: endpoints.placeBid, method: 'POST', body }), invalidatesTags: ['Auction', 'Bid'] }),

    // Notifications
    notifications: builder.query({ query: () => ({ url: endpoints.notifications, method: 'GET' }), providesTags: ['Notification'] }),
    markNotificationRead: builder.mutation({ query: (id) => ({ url: endpoints.markNotificationRead(id), method: 'PUT' }), invalidatesTags: ['Notification'] }),

    createCar: builder.mutation({
  // body should be a FormData instance
  query: (formData) => ({ url: endpoints.createCar, method: 'POST', body: formData }),
  // when a car is created, invalidate Car tag so myCars refetches
  invalidatesTags: ['Car'],
}),
  }),
});

export const {
  useLoginMutation, useRegisterMutation, useMeQuery, useUpdateMeMutation,
  useLiveAuctionsQuery, useAuctionByIdQuery, useMyCarsQuery, useEndAuctionMutation,
  useBidsForAuctionQuery, useMyBidsQuery, usePlaceBidMutation,
  useNotificationsQuery, useMarkNotificationReadMutation, useCreateCarMutation,
} = api;
