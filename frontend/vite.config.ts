import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-ws-resources',
      closeBundle() {
        copyFileSync(
          path.resolve(__dirname, 'ws-resources.json'),
          path.resolve(__dirname, 'dist/ws-resources.json')
        )
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})


