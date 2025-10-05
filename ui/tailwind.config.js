/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // if using Vite
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js", // if using flowbite
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'), // if using flowbite
  ],
};
