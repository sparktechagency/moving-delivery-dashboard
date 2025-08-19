import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi.js";
import authReducer from "./slices/authSlice.js";
import { userApi } from "./api/userManagementApi.js";
import { paymentApi } from "./api/allPayment.js";
import { settingApi } from "./api/settingApi.js";
import { driverApi } from "./api/driverRequest.js";
import { dashboardApi } from "./api/dashboardApi.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [settingApi.reducerPath]:settingApi.reducer,
    [driverApi.reducerPath]:driverApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      paymentApi.middleware,
      settingApi.middleware,
      driverApi.middleware,
      dashboardApi.middleware
    ),
});
