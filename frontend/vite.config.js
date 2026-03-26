import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: '../',
  server: {
    proxy: {
      '/api': {
        target: 'https://capstone-3-library-app.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(
              'Sending Request:',
              req.method,
              req.url,
              ' => TO TARGET => ',
              proxyReq.method,
              proxyReq.protocol,
              proxyReq.host,
              proxyReq.path
            );
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              'Received Response from Target:',
              proxyRes.statusCode,
              req.url
            );
            // Optionally log response headers
            // console.log(JSON.stringify(proxyRes.headers, null, 2)); 
          });
        },
      },
      '/auth': {
        target: 'https://capstone-3-library-app.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log(
              'Sending Request:',
              req.method,
              req.url,
              ' => TO TARGET => ',
              proxyReq.method,
              proxyReq.protocol,
              proxyReq.host,
              proxyReq.path
            );
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log(
              'Received Response from Target:',
              proxyRes.statusCode,
              req.url
            );
            // Optionally log response headers
            // console.log(JSON.stringify(proxyRes.headers, null, 2)); 
          });
        },
      },
    },
  },
})
