import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import SemiPlugin from './src/utils/SemiPlugin'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    base: './',
    server: {
      open: true,
      port: 3001,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      alias: [{ find: '@', replacement: '/src' }]
    },
    plugins: [
      react(),
      SemiPlugin({
        theme: '@semi-bot/semi-theme-doucreator'
      }),
      svgr()
    ],
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true
        }
      }
    },
    assetsInclude: [
      '**/*.mp3',
      '**/*.png',
      '**/*.jpg',
      '**/*.jpeg',
      '**/*.gif',
      '**/*.svg'
    ],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等
          // 最小化拆分包
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString()
            }
          }
        }
      }
    },
    esbuild: {
      drop: ['console', 'debugger'],
      format: 'esm'
    }
  }
})
