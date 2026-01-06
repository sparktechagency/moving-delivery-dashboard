import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/api";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) => {
        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        // Add search parameter if provided
        if (search && search.trim() !== "") {
          params.append("search", search.trim());
        }

        return `auth/find_by_admin_all_users?${params.toString()}`;
      },
      providesTags: ["Users"],
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `auth/change_status/${userId}`,
        method: "PATCH",
        body: { status },
      }),
      // Invalidate the Users tag to refetch the list after status update
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetAllUsersQuery, useUpdateUserStatusMutation } = userApi;
