import path from "path";
import { defineConfig, type HtmlTagDescriptor, type Plugin } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import babel from "@rolldown/plugin-babel";
import oxlintPlugin from "vite-plugin-oxlint";

const proxy = {
  "/api": {
    target: "http://localhost:8000",
    changeOrigin: true,
    rewrite: (path: string) => path.replace(/^\/api/, ""),
  },
};

const FONTS_TO_PRELOAD = [/montserrat-latin-wght-normal.*\.woff2$/];

function preloadFonts(): Plugin {
  let base = "/";
  return {
    name: "preload-fonts",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx): HtmlTagDescriptor[] {
        const files = Object.keys(ctx.bundle ?? {}).filter((file) =>
          FONTS_TO_PRELOAD.some((pattern) => pattern.test(file))
        );

        return files.map((file) => ({
          tag: "link",
          attrs: {
            rel: "preload",
            as: "font",
            type: "font/woff2",
            href: `${base}${file}`,
            crossorigin: "anonymous",
          },
          injectTo: "head-prepend",
        }));
      },
    },
  };
}
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
    oxlintPlugin(),
    preloadFonts(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: { proxy },
  preview: { proxy },
});
