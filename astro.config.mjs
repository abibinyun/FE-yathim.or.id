// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: "https://yathim.or.id",
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  vite: {
    build: {
      cssMinify: true,
      minify: "terser",
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro"],
          },
        },
      },
    },
    ssr: {
      noExternal: ["@tailwindcss/typography"],
    },
  },
  compressHTML: true,
});
