/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",                // root-level HTML files
    "./views/**/*.ejs",        // EJS templates inside 'views'
    "./src/**/*.{js,html,ejs}" // all JS, HTML, and EJS files inside src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
