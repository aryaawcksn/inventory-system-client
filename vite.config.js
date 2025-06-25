import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti ini dengan host ngrok kamu
const allowedNgrokHost = '1ebc-2401-1700-16-1f65-d107-bcb-daa2-427c.ngrok-free.app';

export default defineConfig({
  plugins: [react()],
  server: {
  allowedHosts: ['.ngrok-free.app'], // izinkan semua subdomain ngrok
}
,
})
