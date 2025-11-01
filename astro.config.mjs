// astro.config.js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  site: "https://yathim.or.id",
  output: "static",
  integrations: [
    tailwind({
      applyBaseStyles: true, // pastikan Tailwind base styles aktif
    }),
    react(),
  ],
  build: {
    inlineStylesheets: "auto", // biarkan Astro preload CSS otomatis per page
    assets: "_astro", // folder build (default, tapi eksplisit)
    format: "directory",
  },
  vite: {
    build: {
      cssMinify: true,
      minify: "terser",
      cssCodeSplit: true, // 🟢 pastikan CSS dipisah per halaman
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
  compressHTML: true, // 🟢 Astro akan minify HTML output
  scopedStyleStrategy: "where", // 🟢 performa lebih baik untuk scoped CSS
});
