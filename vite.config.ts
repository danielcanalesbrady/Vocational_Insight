import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy para /usuarios
      "/usuarios": {
        target:
          "https://vocational-insight-562114386469.southamerica-west1.run.app",
        changeOrigin: true,
        secure: false,
      },
      // Proxy para /login
      "/login": {
        target:
          "https://vocational-insight-562114386469.southamerica-west1.run.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
