const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    tailwindcss(),
    autoprefixer(),
    cssnano({ preset: 'default' }),
  ],
};
