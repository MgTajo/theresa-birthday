import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// Deployed to https://mgtajo.github.io/theresa-birthday/ — the repo name has to
// be the base or every asset URL 404s on GitHub Pages.
export default defineConfig({
  base: '/theresa-birthday/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
