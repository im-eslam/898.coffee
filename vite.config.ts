import path from "path";
import { defineConfig, type Plugin } from "vite";
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

function preloadMontserrat(): Plugin {
  let base = "/";
  return {
    name: "preload-montserrat",
    apply: "build",
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const file = Object.keys(ctx.bundle ?? {}).find((f) =>
          /montserrat-latin-wght-normal.*\.woff2$/.test(f)
        );
        if (!file) return;
        return [
          {
            tag: "link",
            attrs: {
              rel: "preload",
              as: "font",
              type: "font/woff2",
              href: `${base}${file}`,
              crossorigin: "anonymous",
            },
            injectTo: "head-prepend",
          },
        ];
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
    preloadMontserrat(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  server: { proxy },
  preview: { proxy },
});
