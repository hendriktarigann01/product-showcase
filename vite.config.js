import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    cors: true,
    allowedHosts: ["localhost", "7d0a58683bba.ngrok-free.app"],
  },
});
