// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// export const API_SERVER_URL = import.meta.env.VITE_API_URL
// console.log("API URL:", import.meta.env.VITE_API_URL)

// export const productsApi = createApi({
//   reducerPath: "productsApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_SERVER_URL}/products`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.user?.token // ✅ centralized
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`)
//       }
//       headers.set("Content-Type", "application/json")
//       return headers
//     },
//   }),
//   tagTypes: ["Product", "ProductById", "Collections", "FilterOptions"],
//   endpoints: (builder) => ({
//     getAllProducts: builder.query({
//       query: () => "",
//       providesTags: ["Product"],
//       transformResponse: (response) => {
//         // Backend returns: { success: true, data: [{data: [...], count: [...]}], message: "..." }
//         const aggregationResult = response.data?.[0] || {}
//         return {
//           products: aggregationResult.data || [],
//           count: aggregationResult.count?.[0]?.total || 0,
//           success: response.success,
//         }
//       },
//     }),
//     getAllCollections: builder.query({
//       query: () => "/collections",
//       providesTags: ["Collections"],
//       transformResponse: (response) => response.collections || [],
//     }),
//     getProductById: builder.query({
//       query: (id) => `/${id}`,
//       providesTags: (result, error, id) => [{ type: "ProductById", id }],
//       transformResponse: (response) => response.data,
//     }),
//     getProductBySlug: builder.query({
//       query: (slug) => `/slug/${slug}`,
//       transformResponse: (response) => response.data,
//     }),
//     getFilterOptions: builder.query({
//       query: () => "/filters/options",
//       providesTags: ["FilterOptions"],
//     }),
//     getFilteredProducts: builder.query({
//       query: (filters) => ({
//         url: "/filter/search",
//         params: filters,
//       }),
//       transformResponse: (response) => response.data || [],
//     }),
//     createProduct: builder.mutation({
//       query: (formData) => ({
//         url: "",
//         method: "POST",
//         body: formData,
//       }),
//       invalidatesTags: ["Product", "Collections", "FilterOptions"],
//       transformResponse: (response) => response.data,
//     }),
//     updateProduct: builder.mutation({
//       query: ({ id, ...data }) => ({
//         url: `/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Product", "ProductById", "Collections"],
//       transformResponse: (response) => response.data,
//     }),
//     deleteProduct: builder.mutation({
//       query: ({ id }) => ({
//         url: `/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Product", "Collections"],
//     }),
//     deleteAllProducts: builder.mutation({
//       query: () => ({
//         url: "",
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Product", "Collections", "FilterOptions"],
//     }),
//   }),
// })

// export const {
//   useGetAllProductsQuery,
//   useGetAllCollectionsQuery,
//   useGetProductByIdQuery,
//   useGetProductBySlugQuery,
//   useGetFilterOptionsQuery,
//   useGetFilteredProductsQuery,
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
//   useDeleteAllProductsMutation,
// } = productsApi









// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// export const API_SERVER_URL = import.meta.env.VITE_API_URL
// console.log("API URL:", import.meta.env.VITE_API_URL)

// export const productsApi = createApi({
//   reducerPath: "productsApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_SERVER_URL}/products`,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.user?.token // ✅ centralized
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`)
//       }
//       // Don't set Content-Type for FormData - let browser set it with boundary
//       return headers
//     },
//   }),
//   tagTypes: ["Product", "ProductById", "Collections", "FilterOptions"],
//   endpoints: (builder) => ({
//     getAllProducts: builder.query({
//       query: () => "",
//       providesTags: ["Product"],
//       transformResponse: (response) => {
//         // Backend returns: { success: true, data: [{data: [...], count: [...]}], message: "..." }
//         const aggregationResult = response.data?.[0] || {}
//         return {
//           products: aggregationResult.data || [],
//           count: aggregationResult.count?.[0]?.total || 0,
//           success: response.success,
//         }
//       },
//     }),
//     getAllCollections: builder.query({
//       query: () => "/collections",
//       providesTags: ["Collections"],
//       transformResponse: (response) => response.collections || [],
//     }),
//     getProductById: builder.query({
//       query: (id) => `/${id}`,
//       providesTags: (result, error, id) => [{ type: "ProductById", id }],
//       transformResponse: (response) => response.data,
//     }),
//     getProductBySlug: builder.query({
//       query: (slug) => `/slug/${slug}`,
//       transformResponse: (response) => response.data,
//     }),
//     getFilterOptions: builder.query({
//       query: () => "/filters/options",
//       providesTags: ["FilterOptions"],
//     }),
//     getFilteredProducts: builder.query({
//       query: (filters) => ({
//         url: "/filter/search",
//         params: filters,
//       }),
//       transformResponse: (response) => response.data || [],
//     }),
//     createProduct: builder.mutation({
//       query: (formData) => ({
//         url: "",
//         method: "POST",
//         body: formData, // FormData object
//       }),
//       invalidatesTags: ["Product", "Collections", "FilterOptions"],
//       transformResponse: (response) => response.data,
//     }),
//     updateProduct: builder.mutation({
//       query: ({ id, ...data }) => ({
//         url: `/${id}`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: ["Product", "ProductById", "Collections"],
//       transformResponse: (response) => response.data,
//     }),
//     deleteProduct: builder.mutation({
//       query: ({ id }) => ({
//         url: `/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Product", "Collections"],
//     }),
//     deleteAllProducts: builder.mutation({
//       query: () => ({
//         url: "",
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Product", "Collections", "FilterOptions"],
//     }),
//   }),
// })

// export const {
//   useGetAllProductsQuery,
//   useGetAllCollectionsQuery,
//   useGetProductByIdQuery,
//   useGetProductBySlugQuery,
//   useGetFilterOptionsQuery,
//   useGetFilteredProductsQuery,
//   useCreateProductMutation,
//   useUpdateProductMutation,
//   useDeleteProductMutation,
//   useDeleteAllProductsMutation,
// } = productsApi










import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const API_SERVER_URL = import.meta.env.VITE_API_URL
console.log("API URL:", import.meta.env.VITE_API_URL)

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_SERVER_URL}/products`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.token
      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Product", "ProductById", "Collections", "FilterOptions"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "",
      providesTags: ["Product"],
      transformResponse: (response) => {
        const aggregationResult = response.data?.[0] || {}
        return {
          products: aggregationResult.data || [],
          count: aggregationResult.count?.[0]?.total || 0,
          success: response.success,
        }
      },
    }),
    getAllCollections: builder.query({
      query: () => "/collections",
      providesTags: ["Collections"],
      transformResponse: (response) => response.collections || [],
    }),
    getProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "ProductById", id }],
      transformResponse: (response) => response.data,
    }),
    getProductBySlug: builder.query({
      query: (slug) => `/slug/${slug}`,
      transformResponse: (response) => response.data,
    }),
    getFilterOptions: builder.query({
      query: () => "/filters/options",
      providesTags: ["FilterOptions"],
    }),
    getFilteredProducts: builder.query({
      query: (filters) => ({
        url: "/filter/search",
        params: filters,
      }),
      transformResponse: (response) => response.data || [],
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product", "Collections", "FilterOptions"],
      transformResponse: (response) => response.data,
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Product", "ProductById", "Collections"],
      transformResponse: (response) => response.data,
    }),
    deleteProduct: builder.mutation({
      query: ({ id }) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "Collections"],
    }),
    deleteAllProducts: builder.mutation({
      query: () => ({
        url: "",
        method: "DELETE",
      }),
      invalidatesTags: ["Product", "Collections", "FilterOptions"],
    }),
  }),
})

export const {
  useGetAllProductsQuery,
  useGetAllCollectionsQuery,
  useGetProductByIdQuery,
  useGetProductBySlugQuery,
  useGetFilterOptionsQuery,
  useGetFilteredProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useDeleteAllProductsMutation,
} = productsApi
