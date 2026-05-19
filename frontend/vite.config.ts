import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/docx-pdf-converter/',
  server: {
    proxy: {
      '/api': 'http://localhost:8001'
    }
  }
})
