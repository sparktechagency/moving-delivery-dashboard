import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/api";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/v1/payment_withdrawal`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) headers.set("Authorization", token);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRecentUsersStatus: builder.query({
      query: () => `/recent_users_status`,
    }),
    getTotalUsersGraph: builder.query({
      query: (year) => `/total_users_graph?year=${year}`,
    }),
    getEarningsOverview: builder.query({
      query: () => `/total_amount_graph`,
    }),
  }),
});

export const {
  useGetRecentUsersStatusQuery,
  useGetTotalUsersGraphQuery,
  useGetEarningsOverviewQuery,
} = dashboardApi;
