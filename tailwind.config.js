const typography = require('@tailwindcss/typography');

module.exports = {
  purge: [
    './theme/**/*.liquid',
    './src/**/*.svelte',
  ],
  corePlugins: {},
  plugins: [
    typography(),
  ],
};
