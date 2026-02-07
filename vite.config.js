import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    host: true,
    port: 5173,

    proxy: {
      "/api": {
        target: "http://10.10.1.200:3000",
        changeOrigin: true,
        secure: false,

        // ✅ THIS LINE FIXES IT
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      "/socket.io": {
        target: "http://10.10.1.200:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
});
