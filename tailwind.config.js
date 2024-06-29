import { nextui } from "@nextui-org/react";

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
        customgradient2: 'rgb(115, 241, 207)',
        customgradient_2: 'rgb(153, 204, 223)',
      },
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'), // Add the typography plugin
    nextui()
  ],
};
