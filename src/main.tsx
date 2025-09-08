import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Providers from "./components/providers.tsx";

const rootEl = document.getElementById("root")!;
const loaderEl = document.getElementById("global-loader");
if (loaderEl) loaderEl.remove();

createRoot(rootEl).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>
);
