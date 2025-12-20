import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// svg使用
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'prod'

  return {
    server: {
      host: '127.0.0.1',
      port: 3000,
      // open: true,
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/douyin': {
          target: 'https://www.douyin.com',
          changeOrigin: true,
          headers: {
            referer: 'https://www.douyin.com/',
            origin: 'https://www.douyin.com/'
          },
          rewrite: (path) => path.replace(/^\/douyin/, '')
        }
      }
    },
    plugins: [
      vue(),
      ElementPlus(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
        dirs: ['src'],
        resolvers: [ElementPlusResolver()],
        eslintrc: {
          enabled: true, // 是否自动生成 eslint 规则，建议生成之后设置 false
          filepath: './.eslintrc-auto-import.json' // 指定自动导入函数 eslint 规则的文件
        }
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // 指定symbolId格式
        symbolId: 'icon-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/mixin.scss" as *; @use "@/assets/styles/variables.scss" as *; `,
          javascriptEnabled: true
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // chunk 大小警告阈值
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || ''
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(info)) {
              return 'assets/images/[name]-[hash][extname]'
            }
            if (/\.(woff2?|eot|ttf|otf)$/.test(info)) {
              return 'assets/fonts/[name]-[hash][extname]'
            }
            if (/\.css$/.test(info)) {
              return 'assets/css/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          },
          // 分包策略
          manualChunks: {
            // Vue 核心
            'vue-vendor': ['vue', 'vue-router', 'pinia'],
            // Element Plus 单独打包
            'element-plus': ['element-plus'],
            // 工具库
            'utils-vendor': ['axios', '@vueuse/core', 'qs'],
            // 播放器单独打包（体积较大）
            'xgplayer': ['xgplayer']
          }
        }
      },
      // 压缩选项
      target: 'es2015',
      // 关闭 brotli 压缩大小报告，提升构建速度
      reportCompressedSize: false
    },
    esbuild: {
      // 生产环境移除 console 和 debugger
      drop: isProd ? ['console', 'debugger'] : [],
      format: 'esm'
    }
  }
})
