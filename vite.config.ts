import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // relative base so the build works on GitHub Pages regardless of repo name
  base: './',
  plugins: [react()],
})
