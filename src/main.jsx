import { createRoot } from "react-dom/client";
import "./index.css";
import { router } from "./router/Routes";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./features/store";
import { ConfigProvider } from "antd"; 

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ConfigProvider>
      <RouterProvider router={router} />
    </ConfigProvider>
  </Provider>
);
