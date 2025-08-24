// src/redux/slices/auth/authApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_SERVER_URL = import.meta.env.VITE_API_URL;

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_SERVER_URL}/auth`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Auth"],
    endpoints: (builder) => ({
        // Login
        login: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Auth"],
        }),

        // Signup
        signup: builder.mutation({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData,
            }),
            invalidatesTags: ["Auth"],
        }),

        // Get user profile
        getProfile: builder.query({
            query: () => "/profile",
            providesTags: ["Auth"],
        }),
    }),
});

export const { useLoginMutation, useSignupMutation, useGetProfileQuery } = authApi;



// // src/redux/slices/auth/authApi.js
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// export const API_SERVER_URL = import.meta.env.VITE_API_URL

// export const authApi = createApi({
//   reducerPath: "authApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_SERVER_URL}/auth`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`)
//       }
//       return headers
//     },
//   }),
//   tagTypes: ["Auth"],
//   endpoints: (builder) => ({
//     // Login
//     login: builder.mutation({
//       query: (credentials) => ({
//         url: "/login",
//         method: "POST",
//         body: credentials,
//       }),
//       invalidatesTags: ["Auth"],
//     }),

//     // Signup
//     signup: builder.mutation({
//       query: (userData) => ({
//         url: "/register",
//         method: "POST",
//         body: userData,
//       }),
//       invalidatesTags: ["Auth"],
//     }),

//     // Get user profile
//     getProfile: builder.query({
//       query: () => "/profile",
//       providesTags: ["Auth"],
//     }),
//   }),
// })

// export const { useLoginMutation, useSignupMutation, useGetProfileQuery } = authApi

