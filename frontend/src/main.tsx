import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import MainLayout from "./MainLayout.tsx";
import { Provider } from "react-redux";
import store from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <MainLayout>
      <StrictMode>
        <App />
      </StrictMode>
    </MainLayout>
  </Provider>
);
