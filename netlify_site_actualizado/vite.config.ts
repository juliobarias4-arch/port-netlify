import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Vite outputs the production build into `public/`, which Netlify serves
// (see netlify.toml `publish = "public"`). During `npm run dev`, the Netlify
// Functions under /api/* do not exist, so the app falls back to the embedded
// fixture (see src/lib/api.ts + import.meta.env.DEV).
export default defineConfig({
  plugins: [react()],
  // Default publicDir is "public", but we use "public" as the build outDir.
  // Point publicDir at "static" so the two never collide.
  publicDir: "static",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "public",
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
        },
      },
    },
  },
});
