import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        portfolio: "portfolio.html",
        services: "services.html",
        about: "about.html",
        journal: "journal.html",
        contact: "contact.html",
      },
    },
  },
});
