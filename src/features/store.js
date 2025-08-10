import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi.js";
import authReducer from "./slices/authSlice.js"
import { userApi } from "./api/userManagementApi.js";
import { paymentApi } from "./api/allPayment.js";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
     [userApi.reducerPath]: userApi.reducer,
      [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,userApi.middleware,paymentApi.middleware),
});
