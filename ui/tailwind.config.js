/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // if using Vite
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js", // if using flowbite
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
       colors: {
        // Primary Colors
        // primary: "#9061f9",
        primary: "#9061f9 ",
        "primary-light": "#90CAF9",
        "primary-dark": "#3367D6",
        "primary-hover-fill": "#F6F8FD",
        "primary-active-fill": "#EEF4FD",
        "primary-light-shade": "#f8fafd",

        // Gray Scale
        gray: {
          light: "#BDBDBD",
          base: "#9E9E9E",
          dark: "#757575",
        },
        black: "#212121",
        "brand-100": "#f0f4f9",
        "brand-200": "#e6eaf1",
        "brand-300": "#585858",
        "brand-400": "#dfe4ea",
        "tooltip-bg": "#3C4043",
        // Brand Colors
        "brand-text": "#5F6368",
        "brand-green": "#34A853",
        yellow: "#FBBC04",
        "brand-red": "#EA4335",
        model: {
          bg: "#e6f4ff",
        },
        widget: {
          bg: "#F8F9FB",
        },
        stock: {
          positive: "#1D5D2D",
          negative: "#9D2020",
        },
      },
      
    },
  },
  plugins: [
    require('flowbite/plugin'), // if using flowbite
  ],
 
};
