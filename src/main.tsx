import "@fontsource-variable/montserrat/wght.css";
import "@fontsource-variable/cairo/wght.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import montserratUrl from "@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2?url";

const preload = document.createElement("link");
preload.rel = "preload";
preload.as = "font";
preload.type = "font/woff2";
preload.crossOrigin = "anonymous";
preload.href = montserratUrl;
document.head.append(preload);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
