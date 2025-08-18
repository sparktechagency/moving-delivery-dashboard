// src/features/api/settingApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/api";

export const settingApi = createApi({
  reducerPath: "settingApi",
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
    // ✅ GET About Us
    getAbout: builder.query({
      query: () => "/v1/setting/find_by_about_us",
    }),
    // ✅ Update About Us
    updateAbout: builder.mutation({
      query: (body) => ({
        url: "/v1/setting/about",
        method: "POST",
        body,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    // GET Privacy Policy
    getPrivacyPolicy: builder.query({
      query: () => "/v1/setting/find_by_privacy_policyss",
    }),
    // Update Privacy Policy
    updatePrivacyPolicy: builder.mutation({
      query: (body) => ({
        url: "/v1/setting/privacy_policys",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    // GET Terms & Conditions
    getTerms: builder.query({
      query: () => "/v1/setting/find_by_terms_conditions",
    }),
    // POST Terms & Conditions
    updateTerms: builder.mutation({
      query: (body) => ({
        url: "/v1/setting/terms_conditions",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    // change password 
    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/v1/user/change_password", 
        method: "PATCH",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const {
  useGetAboutQuery,
  useUpdateAboutMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
  useGetTermsQuery,useUpdateTermsMutation, useChangePasswordMutation
} = settingApi;
