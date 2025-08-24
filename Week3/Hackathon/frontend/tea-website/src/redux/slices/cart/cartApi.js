// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// export const cartApi = createApi({
//   reducerPath: "cartApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_BASE_URL}/cart`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.user?.token
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`)
//       }
//       return headers
//     },
//   }),
//   tagTypes: ["Cart"],
//   endpoints: (builder) => ({
//     // Get user's cart from backend
//     getUserCart: builder.query({
//       query: () => "/",
//       providesTags: ["Cart"],
//       transformResponse: (response) => {
//         if (response.success && response.data) {
//           // Transform backend cart structure to frontend structure
//           const cartItems =
//             response.data.products?.map((item) => ({
//               id: `${item.product._id}-${item.variant}`,
//               productId: item.product._id,
//               name: item.product.name,
//               image: item.product.images, // Backend uses 'images' not 'image'
//               price: item.product.variants?.find((v) => v.weight === item.variant)?.price || 0,
//               weight: item.variant,
//               quantity: item.quantity,
//               totalPrice: (item.product.variants?.find((v) => v.weight === item.variant)?.price || 0) * item.quantity,
//             })) || []

//           return {
//             items: cartItems,
//             totalQuantity: cartItems.reduce((total, item) => total + item.quantity, 0),
//             totalAmount: cartItems.reduce((total, item) => total + item.totalPrice, 0),
//           }
//         }
//         return { items: [], totalQuantity: 0, totalAmount: 0 }
//       },
//     }),

//     // Add item to cart
//     addToCart: builder.mutation({
//       query: ({ productId, variant, quantity = 1 }) => ({
//         url: "/",
//         method: "POST",
//         body: { productId, variant, quantity },
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     // Update item quantity
//     updateCartItemQuantity: builder.mutation({
//       query: ({ cartItemId, action }) => ({
//         url: `/${action}/${cartItemId}`,
//         method: "PATCH",
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     // Remove item from cart
//     removeFromCart: builder.mutation({
//       query: (cartItemId) => ({
//         url: `/${cartItemId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Cart"],
//     }),

//     // Clear entire cart
//     clearCart: builder.mutation({
//       query: () => ({
//         url: "/",
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Cart"],
//     }),
//   }),
// })

// export const {
//   useGetUserCartQuery,
//   useAddToCartMutation,
//   useUpdateCartItemQuantityMutation,
//   useRemoveFromCartMutation,
//   useClearCartMutation,
// } = cartApi





import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_BASE_URL = import.meta.env.VITE_API_URL

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/cart`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // Get user's cart from backend
    getUserCart: builder.query({
      query: () => "/",
      providesTags: ["Cart"],
      transformResponse: (response) => {
        if (response.success && response.data) {
          const cartItems =
            response.data.map((item) => ({
              id: item.cartItemId, // Use cartItemId from backend as id
              productId: item.productId,
              name: item.name,
              image: item.image, // Backend already returns single image
              price: item.price,
              weight: item.variant, // Backend returns variant as weight
              variant: item.variant, // Keep variant for display
              quantity: item.quantity,
              totalPrice: item.total, // Backend returns total, not totalPrice
            })) || []

          return {
            items: cartItems,
            totalQuantity: cartItems.reduce((total, item) => total + item.quantity, 0),
            totalAmount: cartItems.reduce((total, item) => total + item.totalPrice, 0),
          }
        }
        return { items: [], totalQuantity: 0, totalAmount: 0 }
      },
    }),

    // Add item to cart
    addToCart: builder.mutation({
      query: ({ productId, variant, quantity = 1 }) => ({
        url: "/",
        method: "POST",
        body: { prod_id: productId, variant, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // Update item quantity
    updateCartItemQuantity: builder.mutation({
      query: ({ cartItemId, action }) => ({
        url: `/${action}/${cartItemId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Remove item from cart
    removeFromCart: builder.mutation({
      query: (cartItemId) => ({
        url: `/${cartItemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Clear entire cart
    clearCart: builder.mutation({
      query: () => ({
        url: "/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
})

export const {
  useGetUserCartQuery,
  useAddToCartMutation,
  useUpdateCartItemQuantityMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi
