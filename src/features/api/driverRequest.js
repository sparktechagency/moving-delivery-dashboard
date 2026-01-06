import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/api";

export const driverApi = createApi({
  reducerPath: "driverApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", token);
      }
      return headers;
    },
  }),

  tagTypes: ["Driver"],

  endpoints: (builder) => ({
    // -------------------- GET DRIVERS WITH PAGINATION --------------------
    getDriver: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => {
        // Build query parameters
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });
        
        // Add search parameter if provided
        if (search && search.trim() !== '') {
          params.append('search', search.trim());
        }
        
        return `/v1/driver_verification/find_by_all__driver_verfiction_admin?${params.toString()}`;
      },
      providesTags: ["Driver"],
    }),

    // -------------------- ACCEPT DRIVER --------------------
    acceptDriver: builder.mutation({
      query: ({ id, driverId }) => ({
        url: `/v1/driver_verification/driver_verification/${id}`,
        method: "PATCH",
        body: {
          driverId,
          isVerifyDriverLicense: true,
          isVerifyDriverNid: true,
          isReadyToDrive: true,
        },
      }),
      invalidatesTags: ["Driver"],
    }),

    // -------------------- DELETE DRIVER --------------------
    deleteDriver: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/driver_verification/delete_driver_verification_request/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Driver"],
    }),
  }),
});

export const {
  useGetDriverQuery,
  useAcceptDriverMutation,
  useDeleteDriverMutation,
} = driverApi;