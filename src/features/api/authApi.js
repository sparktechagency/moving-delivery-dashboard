import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/api";

export const authApi = createApi({
  reducerPath: "authApi",
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
    // 🔹 Login user
    signin: builder.mutation({
      query: (credentials) => ({
        url: "/v1/auth/login_user",
        method: "POST",
        body: credentials,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

     getMyProfile: builder.query({
      query: () => ({
        url: "/v1/auth/myprofile",
        method: "GET",
      }),
    }),

    // 🔹 Update Profile
    updateProfile: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("location", data.location);
        if (data.photo) {
          formData.append("photo", data.photo);
        }

        return {
          url: "/v1/auth/update_my_profile",
          method: "PATCH",
          body: formData,
        };
      },
    }),
  }),
});

export const { 
  useSigninMutation, 
  useUpdateProfileMutation ,
  useGetMyProfileQuery
} = authApi;
