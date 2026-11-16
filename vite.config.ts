import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://shailendrakanshana.github.io/My_Portfolio/
export default defineConfig({
  base: '/My_Portfolio/',
  plugins: [react()],
  build: { target: 'es2020', cssCodeSplit: false },
});
