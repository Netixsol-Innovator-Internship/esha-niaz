
'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setMeFromToken, logout } from '../slices/authSlice';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    headers.set('content-type','application/json');
    return headers;
  }
});


// api.js me
// const baseQueryForUpload = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   prepareHeaders: (headers, { getState }) => {
//     const token = getState().auth.token;
//     if (token) headers.set('authorization', `Bearer ${token}`);
//     // **JSON content-type nahi set karna** for FormData
//     return headers;
//   }
// });

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result?.error && (result.error.status === 401 || result.error.status === 403)) {
    api.dispatch(logout());
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
      tagTypes: ["Me", "Ratings", "Products", "Cart", "Orders", "Users", "Notification"],
  endpoints: (builder) => ({
    // Auth
    signup: builder.mutation({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body })
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({ url: '/auth/verify-otp', method: 'POST', body })
    }),
    resendOtp: builder.mutation({
      query: (body) => ({ url: '/auth/resend-otp', method: 'POST', body })
    }),
    login: builder.mutation({
      query: (body) => ({ url: '/auth/login', method: 'POST', body })
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({ url: '/auth/forgot-password', method: 'POST', body })
    }),
    resetPassword: builder.mutation({
      query: (body) => ({ url: '/auth/reset-password', method: 'POST', body })
    }),
    // Users
    getMe: builder.query({
      query: () => ({ url: '/users/me', method: 'GET' }),
      providesTags: ['Me']
    }),
    updateProfile: builder.mutation({
      query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
      invalidatesTags: ['Me']
    }),


        // ================== PRODUCTS ==================
    getProducts: builder.query({
      query: () => ({ url: '/products', method: 'GET' }),
      providesTags: ['Products']
    }),
    // getProductById: builder.query({
    //   query: (id) => ({ url: `/products/${id}`, method: 'GET' }),
    //   providesTags: ['Products']
    // }),



    // Products
    getProductById: builder.query({
      query: (id) => ({ url: `/products/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    // Ratings
    getRatings: builder.query({
      query: (productId) => ({ url: `/ratings/${productId}`, method: "GET" }),
      providesTags: (result, error, productId) => [{ type: "Ratings", id: productId }],
    }),

    addRating: builder.mutation({
      query: ({ productId, stars, comment }) => ({
        url: `/ratings`,
        method: "POST",
        body: { productId, stars, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Ratings", id: productId },
        { type: "Products", id: productId }, // must match getProductById
      ],
    }),



    // CART
getCart: builder.query({
  query: () => "carts/me",
  providesTags: ["Cart"],
}),
incrementCart: builder.mutation({
  query: (body) => ({
    url: "carts/increment",
    method: "PATCH",
    body,
  }),
  invalidatesTags: ["Cart"],
}),
decrementCart: builder.mutation({
  query: (body) => ({
    url: "carts/decrement",
    method: "PATCH",
    body,
  }),
  invalidatesTags: ["Cart"],
}),
removeCart: builder.mutation({
  query: ({ productId }) => ({
    url: `carts/remove?productId=${productId}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Cart"],
}),


addCartItem: builder.mutation({
  query: (payload) => ({
    url: "/carts/add",
    method: "POST",
    body: payload,
  }),
  invalidatesTags: ["Cart"], // so cart refreshes after adding
}),



  // ================== ORDERS ================== ✅ NEW
    createOrder: builder.mutation({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Orders", "Cart"], // clears cart after order
    }),

    getMyOrders: builder.query({
      query: () => ({ url: "/orders/me", method: "GET" }),
      providesTags: ["Orders"],
    }),



    // inside api.js endpoints
getAllUsers: builder.query({
  query: () => ({ url: "/users", method: "GET" }),
  providesTags: ["Users"],
}),

setUserRole: builder.mutation({
  query: ({ userId, role }) => ({
    url: "/users/role",
    method: "PATCH",
    body: { userId, role },
  }),
  invalidatesTags: ["Users"],
}),


// ================== PRODUCTS (Complete) ==================
getProducts: builder.query({
  query: () => ({ url: '/products', method: 'GET' }),
  providesTags: ['Products'],
}),

getProductById: builder.query({
  query: (id) => ({ url: `/products/${id}`, method: 'GET' }),
  providesTags: (result, error, id) => [{ type: 'Products', id }],
}),

createProduct: builder.mutation({
  query: (body) => ({
    url: '/products',
    method: 'POST',
    body,
  }),
  invalidatesTags: ['Products'],
}),

updateProduct: builder.mutation({
  query: ({ id, body }) => ({
    url: `/products/${id}`,
    method: 'PATCH',
    body,
  }),
  invalidatesTags: ['Products'],
}),

deleteProduct: builder.mutation({
  query: (id) => ({
    url: `/products/${id}`,
    method: 'DELETE',
  }),
  invalidatesTags: ['Products'],
}),

setSale: builder.mutation({
  query: ({ id, discountPercent, startTime, endTime }) => ({
    url: `/products/${id}/sale`,
    method: 'POST',
    body: { discountPercent, startTime, endTime },
  }),
  invalidatesTags: ['Products'],
}),



uploadImage: builder.mutation({
  query: ({ id, formData }) => ({
    url: `/products/${id}/upload-image`,
    method: "POST",
    body: formData,
    // 👇 override headers here so JSON isn't forced
    headers: {
      // leave out content-type → browser sets correct multipart boundary
    },
  }),
  invalidatesTags: ["Products"],
}),


 getRecentOrders: builder.query({
      query: () => '/orders/recent',
      providesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status/${status}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Orders'],
    }),



    // api.js
getNotifications: builder.query({
  query: (userId) => `/notifications/${userId}`,
  providesTags: ['Notification'],
}),
markNotificationRead: builder.mutation({
  query: (id) => ({
    url: `/notifications/${id}/read`,
    method: 'PATCH',
  }),
  invalidatesTags: ['Notification'],
}),

  }),
});

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetMeQuery,
  useUpdateProfileMutation,

    // ✅ products
  useGetProductsQuery,
  useGetProductByIdQuery,

  useGetRatingsQuery,
  useAddRatingMutation,


  useGetCartQuery,
  useIncrementCartMutation,
  useDecrementCartMutation,
  useRemoveCartMutation,

  useAddCartItemMutation, // 👈 new


    // Orders ✅
  useCreateOrderMutation,
  useGetMyOrdersQuery,

    // ...
  useGetAllUsersQuery,
  useSetUserRoleMutation,




  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSetSaleMutation,


    // Add this hook for uploading images
  useUploadImageMutation,




  useGetRecentOrdersQuery,
   useUpdateOrderStatusMutation,



   useGetNotificationsQuery,
  useMarkNotificationReadMutation,

  
} = api;
