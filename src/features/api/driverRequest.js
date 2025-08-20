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
  endpoints: (builder) => ({
    getDriver: builder.query({
      query: () =>
        "/v1/driver_verification/find_by_all__driver_verfiction_admin",
    }),
    // Accept driver (all true)
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
    }),

    blockDriver: builder.mutation({
      query: ({ id, driverId }) => ({
        url: `/v1/driver_verification/driver_verification/${id}`,
        method: "PATCH",
        body: {
          driverId,
          isVerifyDriverLicense: false,
          isVerifyDriverNid: false,
          isReadyToDrive: false,
        },
      }),
    }),
  }),
});

export const {
  useGetDriverQuery,
  useAcceptDriverMutation,
  useBlockDriverMutation,
} = driverApi;
