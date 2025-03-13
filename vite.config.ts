import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from "rollup-plugin-visualizer"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import path from "node:path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cesium(), tailwindcss(), TanStackRouterVite({ target: 'react', autoCodeSplitting: true })],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    minify: "terser",
    // rollup 配置
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // // 截取node_modules后面的数据
            // const parts = id.split('node_modules/')[1]
            // // console.log(parts, '==111=')
            // const [first] = parts.split('/')
            // // console.log(first, '==222=')
            // if (first) {
            //   return first // 将node_modules中的依赖按文件夹分类
            // }
            // console.log(second, '==333=')
            return 'vendor' // 将所有node_modules中的依赖打包到vendor.js
          }
        },
        chunkFileNames: "js/[name]-[hash].js", // 引入文件名的名称
        entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
        assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
      },
      plugins: [
        visualizer({
          open: true, // 直接在浏览器中打开分析报告
          filename: "stats.html", // 输出文件的名称
          gzipSize: true, // 显示gzip后的大小
          brotliSize: true, // 显示brotli压缩后的大小
        })
      ],
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
