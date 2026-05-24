import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  envDir: "../",
  plugins: [react(), tailwindcss(),],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production")
  },
  build: {
    lib: {
      entry: "src/widget-entry.tsx",
      name: "AssistantWidget",
      formats: ["iife"],
      fileName: () => "widget.js"
    }
  }
})
