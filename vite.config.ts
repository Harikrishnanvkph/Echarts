import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'echarts': ['echarts'],
          'mui': ['@mui/material', '@mui/icons-material'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
