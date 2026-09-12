import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'dev/playground',
  plugins: [react()],
  server: {
    port: 5183,
  },
});
