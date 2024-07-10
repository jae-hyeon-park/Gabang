import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        background_color: '#ffffff',
        description: 'GABANG',
        name: 'GABANG',
        short_name: 'GABANG',
        start_url: '/',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/images/192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: '/images/192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: '/images/512.png',
            type: 'image/png',
            sizes: '512x512',
          },
          {
            src: '/images/512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  server: {
    proxy: {
      // 프록시 요청을 '/api'로 시작하는 경우
      // 예: React 앱에서 '/api/greeting'으로 요청을 보내면,
      // 실제 요청은 'http://localhost:8080/api/greeting'으로 프록시됩니다.
      '/api': {
        target: 'http://localhost:8080',
        // target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/node/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/node/, ''),
      },
      // WebSocket 프록시를 추가합니다.
      '/ws': {
        target: 'ws://localhost:8080', // WebSocket 서버의 주소를 여기에 입력하세요.
        changeOrigin: true,
        ws: true,
        // 프록시 웹소켓에 대한 업그레이드와 연결 헤더를 추가합니다.
        onProxyReq: (proxyReq, req, res) => {
          proxyReq.setHeader('Upgrade', 'websocket');
          proxyReq.setHeader('Connection', 'Upgrade');
        },
      },
    },
  },
});
