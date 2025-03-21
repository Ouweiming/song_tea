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
