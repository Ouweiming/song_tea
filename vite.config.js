import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
// 修改导入方式：直接导入 tailwindcss
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

// 尝试导入可选插件，如果不存在则使用空对象
let visualizer;
try {
  visualizer = (await import('rollup-plugin-visualizer')).visualizer;
} catch (e) {
  visualizer = () => null;
}

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
    // 使用新的 __dirname 变量
    return fs.readFileSync(
      path.resolve(__dirname, 'src/critical.css'),
      'utf-8'
    );
  } catch (e) {
    // 如果文件不存在，返回空字符串
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
  
  // 可选：添加bundle分析工具
  if (visualizer && process.env.ANALYZE) {
    plugins.push(visualizer({ open: true }));
  }
  
  return plugins.filter(Boolean);
};

export default defineConfig({
  plugins: createPlugins(),
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer], // 直接使用 tailwindcss 插件
    },
    // 启用CSS代码分割
    modules: {
      generateScopedName: process.env.NODE_ENV === 'production' 
        ? '[hash:base64:6]'
        : '[local]_[hash:base64:6]'
    },
    // 提取CSS到单独的文件，便于缓存
    devSourcemap: true,
    // 启用CSS代码分割
    codeSplit: true
  },
  build: {
    // 启用源码压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 删除console
        drop_debugger: true // 删除debugger
      }
    },
    // 优化资源处理
    assetsInlineLimit: 4096, // 小于4kb的资源内联为base64
    chunkSizeWarningLimit: 1000, // 块大小警告限制
    
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
          // UI框架相关
          'vendor-ui': ['@nextui-org/react', '@nextui-org/theme'],
          // 动画相关
          'vendor-animation': ['framer-motion', 'gsap', '@gsap/react', '@react-spring/web'],
          // 工具库
          'vendor-utils': ['react-router-dom', 'react-intersection-observer'],
          // React基础库
          'vendor-react': ['react', 'react-dom']
        }
      }
    }
  }
});