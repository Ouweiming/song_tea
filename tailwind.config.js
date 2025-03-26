import { nextui } from "@nextui-org/react";
import tailwindForms from '@tailwindcss/forms';
import tailwindTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // 增加字体大小配置
      fontSize: {
        'xs': '0.875rem',    // 14px
        'sm': '1rem',        // 16px
        'base': '1.0625rem', // 17px
        'lg': '1.125rem',    // 18px
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
        '3xl': '1.875rem',   // 30px
        '4xl': '2.25rem',    // 36px
        '5xl': '3rem',       // 48px
        '6xl': '3.75rem',    // 60px
      },
      // 配置主字体 - 更新为系统字体
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'PingFang SC', 'Microsoft YaHei', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        serif: ['SimSun', '宋体', 'FangSong', '仿宋', 'ui-serif', 'Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
      },
      colors: {
        customgradient1: 'rgb(246, 242, 233)',
        customgradient_1: 'rgb(142, 212, 202)',
        customgradient2: 'rgb(15, 65, 80)',  // 调整为更深的蓝绿色，提高对比度
        customgradient_2: 'rgb(95, 160, 110)', // 调整为更深的绿色，提高对比度
        
        // 扩展主题颜色，确保可访问性
        brand: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
      },
      boxShadow: {
        large: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      textShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
        md: '0 2px 4px rgba(0, 0, 0, 0.1)',
        lg: '0 2px 6px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  darkMode: "class",
  plugins: [
    tailwindForms,
    tailwindTypography,
    // line-clamp 功能现已内置到 Tailwind 核心中
    nextui(),
    // 添加文本阴影插件
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
};
