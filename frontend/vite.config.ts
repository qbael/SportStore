import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   // tTien
   server: {
    watch: {
      usePolling: true,   // ép Vite dùng polling thay vì file system events
    },
    host: true,           // cho phép truy cập từ localhost hoặc IP
    strictPort: true,
  }
  // tTien end
})
