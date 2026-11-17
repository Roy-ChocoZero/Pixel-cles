import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// La configuration de Vite : le JSX, Tailwind, le raccourci « @ » vers src/, et le relais vers l'API.
export default defineConfig(
  {
    plugins: [react(), tailwindcss()],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') }, },
    server: {
      // En développement, tout ce qui commence par /api est transmis à l'API (npm run api). 
      // Pour le navigateur, c'est la même origine que la page : pas de CORS. 
      proxy: { '/api': 'http://localhost:3000', },
    },
  }
);
