import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/api";

export const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/v1/payment_gateway`,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            console.log("the token is", token)
            if (token) {
                headers.set("Authorization", token);
            }
            return headers;
        },
    }),
    tagTypes: ["Payments"],
    endpoints: (builder) => ({
        getAllPayments: builder.query({
            query: ({ page = 1, limit = 10 } = {}) =>
                `/all_payment?page=${page}&limit=${limit}`,
            providesTags: ["Payments"],
        }),
    }),
});

export const { useGetAllPaymentsQuery } = paymentApi;
