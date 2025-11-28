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

  tagTypes: ["Driver"],  // ✅ MUST ADD THIS

  endpoints: (builder) => ({

    // -------------------- GET DRIVERS --------------------
    getDriver: builder.query({
      query: () =>
        "/v1/driver_verification/find_by_all__driver_verfiction_admin",
      providesTags: ["Driver"],      // ✅ ADD THIS
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
      invalidatesTags: ["Driver"],   // 🟢 Refresh list
    }),

    // -------------------- DELETE DRIVER --------------------
    deleteDriver: builder.mutation({
      query: ({ id }) => ({
        url: `/v1/driver_verification/delete_driver_verification_request/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Driver"],    // 🟢 This NOW works!
    }),
  }),
});

export const {
  useGetDriverQuery,
  useAcceptDriverMutation,
  useDeleteDriverMutation,
} = driverApi;
