import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { apiEditorPlugin } from './server/api-editor'

export default defineConfig({
  plugins: [react(), apiEditorPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    // 开发服务器端口
    port: 3002,
    // 端口被占用时自动尝试下一个可用端口
    strictPort: false,
    // 自动打开浏览器
    open: true,
    // 主机地址，允许局域网访问
    host: true,
    // 热更新配置
    hmr: {
      overlay: true
    },
    // 代理配置（如需跨域请求 API）
    proxy: {
      '/api': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    // 预览服务器端口
    port: 5180,
    // 自动打开浏览器
    open: true,
    // 允许局域网访问
    host: true
  },
  build: {
    // 输出目录
    outDir: 'dist',
    // 生产环境不生成 sourcemap
    sourcemap: false,
    // 代码压缩方式
    minify: 'esbuild',
    // chunk 大小警告限制 (kB)
    chunkSizeWarningLimit: 500,
    // Rollup 打包配置
    rollupOptions: {
      output: {
        // 分包策略
        manualChunks: {
          // React 相关
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Radix UI 组件
          'vendor-radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip'
          ],
          // 工具库
          'vendor-utils': ['clsx', 'tailwind-merge', 'class-variance-authority']
        },
        // 静态资源文件名格式
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-accordion',
      '@radix-ui/react-tabs',
      '@radix-ui/react-scroll-area'
    ]
  }
})
