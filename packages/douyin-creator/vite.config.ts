import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import SemiPlugin from './src/utils/SemiPlugin'
import svgr from 'vite-plugin-svgr'
// https://vitejs.dev/config/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
   
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
      minify: 'esbuild',
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js', // 引入文件名的名称
          entryFileNames: 'js/[name]-[hash].js', // 包的入口文件名称
          assetFileNames: '[ext]/[name]-[hash].[ext]', // 资源文件像 字体，图片等

          manualChunks(id) {
            if (id.includes('node_modules')) {
              return 'vendor'
            }
            if (id.includes('/home/')) {
              const fileName = id.substring(
                id.lastIndexOf('/') + 1,
                id.lastIndexOf('.')
              )
              return `home-${fileName}`
            }
            if (id.includes('/content')) {
              const fileName = id.substring(
                id.lastIndexOf('/') + 1,
                id.lastIndexOf('.')
              )
              return `content-${fileName}`
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
