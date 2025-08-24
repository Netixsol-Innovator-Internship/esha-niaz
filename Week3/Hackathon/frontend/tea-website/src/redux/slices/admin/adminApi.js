import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_SERVER_URL } from "../auth/authApi.js"

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_SERVER_URL}/users`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.token; // ✅ safer way
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    // ✅ Fetch all users
    getAllUsers: builder.query({
      query: () => "/",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((u) => ({ type: "Users", id: u._id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),

    // ✅ Change user role
    changeUserRole: builder.mutation({
      query: ({ userId, role }) => ({
        url: `/${userId}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),

    // ✅ Block or unblock user
    blockUnblockUser: builder.mutation({
      query: ({ userId, blocked }) => ({
        url: `/${userId}/${blocked ? "block" : "unblock"}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "Users", id: userId },
        { type: "Users", id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAllUsersQuery,
  useChangeUserRoleMutation,
  useBlockUnblockUserMutation,
} = adminApi
