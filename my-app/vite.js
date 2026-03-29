import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "public",   // IMPORTANT: tells Vite where index.html is
  plugins: [react()],
  server: {
    open: true
  }
});