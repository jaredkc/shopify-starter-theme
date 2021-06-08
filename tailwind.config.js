const typography = require('@tailwindcss/typography');

module.exports = {
  mode: 'jit',
  purge: [
    './theme/**/*.liquid',
    './src/**/*.svelte',
  ],
  corePlugins: {},
  plugins: [
    typography(),
  ],
};
