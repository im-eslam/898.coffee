import "@fontsource-variable/montserrat/wght.css";
import "@fontsource-variable/cairo/wght.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { prefetchMenu } from "@/features/menu/hooks/use-data";

if (window.location.pathname.startsWith("/menu")) {
  prefetchMenu();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
