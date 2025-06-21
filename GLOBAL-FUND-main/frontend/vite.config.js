import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176, // your frontend runs here
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5176, // match this to the dev server port
    },
  },
})
