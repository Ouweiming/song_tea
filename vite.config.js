import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig } from 'vite';

// 导入node:process模块和其他必要模块
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

// 获取当前文件的目录路径（ESM 兼容方式）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 尝试导入可选的HTML插件
let createHtmlPlugin;
try {
  createHtmlPlugin = (await import('vite-plugin-html')).createHtmlPlugin;
} catch (e) {
  createHtmlPlugin = () => null;
}

// 读取内联关键CSS
const getCriticalCSS = () => {
  try {
    return fs.readFileSync(
      path.resolve(__dirname, 'src/critical.css'),
      'utf-8'
    );
  } catch (e) {
    return '';
  }
};

// 创建插件配置函数
const createPlugins = () => {
  const plugins = [react()];
  
  // 添加HTML处理插件，实现关键CSS内联
  if (createHtmlPlugin) {
    plugins.push(
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            criticalCss: process.env.NODE_ENV === 'production' 
              ? getCriticalCSS()
              : '', 
          },
        },
      })
    );
  }
  
  return plugins.filter(Boolean);
};

export default defineConfig({
  plugins: createPlugins(),
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
    // 启用CSS代码分割
    modules: {
      generateScopedName: process.env.NODE_ENV === 'production' 
        ? '[hash:base64:6]'
        : '[local]_[hash:base64:6]'
    },
    // 提取CSS到单独的文件，便于缓存
    devSourcemap: false, // 生产环境不需要sourcemap
    // 启用CSS代码分割
    codeSplit: true
  },
  build: {
    // 启用源码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 删除console
        drop_debugger: true, // 删除debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'] // 移除所有控制台输出函数
      }
    },
    // 优化资源处理
    assetsInlineLimit: 4096, // 小于4kb的资源内联为base64
    chunkSizeWarningLimit: 1000, // 块大小警告限制
    
    // 添加报告生成，分析包大小
    reportCompressedSize: true,
    
    // 打包分块策略
    rollupOptions: {
      output: {
        // 确保CSS也能够被分块
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          let extType = info[info.length - 1];
          
          if (/\.(jpe?g|png|gif|webp|avif|svg)$/i.test(assetInfo.name)) {
            extType = 'img';
          }
          
          if (extType === 'css') {
            return 'assets/css/[name]-[hash][extname]';
          }
          
          if (extType === 'img') {
            return 'assets/imgs/[name]-[hash][extname]';
          }
          
          return 'assets/[name]-[hash][extname]';
        },
        // 为主要入口点创建一个单独的CSS文件
        entryFileNames: 'assets/js/[name]-[hash].js',
        // 为代码分割的块创建单独的文件
        chunkFileNames: 'assets/js/[name]-[hash].js',
        manualChunks: {
          // 修改块配置:
          'vendor-framework': ['react', 'react-dom', 'react/jsx-runtime'],
          'vendor-ui': ['@nextui-org/react', '@nextui-org/theme'],
          'vendor-utils': ['react-router-dom', 'react-intersection-observer']
        }
      }
    }
  },
  // 添加资源分析选项
  esbuild: {
    drop: ['console', 'debugger'], // 使用esbuild也移除console和debugger
  }
});