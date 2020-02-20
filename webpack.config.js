const path = require('path');
const glob = require('glob');
const read = require('read-yaml');
const config = read.sync('config.yml');
const themeID = config.development.theme_id;
const storeURL = config.development.store;
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

const PATHS = {
  assets: path.resolve(__dirname, 'theme/assets'),
  theme: path.join(__dirname, 'theme')
}

module.exports = {
  mode: 'development',
  entry: {
    theme: './src/js/theme.js',
    product: './src/js/product.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: PATHS.assets,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  stats: { children: false },
  plugins: [
    // Extract CSS to external file to load styles in Shopify theme as normal
    new MiniCssExtractPlugin({ filename: '[name].bundle.css', }),
    // Remove unused css styles, checks against everything in the theme directory
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.theme}/**/*`, { nodir: true })
    }),
    new BrowserSyncPlugin({
      https: true,
      port: 3000,
      proxy: `https://${storeURL}?preview_theme_id=${themeID}`,
      reloadDelay: 2000,
      middleware: [
        function (req, res, next) {
          // Add url paramaters for Shopify theme preview.
          // ?_fd=0 prevents domain forwarding, ?pb=0 hides the Shopify preview bar
          const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
          const queryStringComponents = ['_ab=0&_fd=0&_sc=1&pb=0'];
          req.url += prefix + queryStringComponents.join('&');
          next();
        }
      ],
      files: [{
        match: [
          '**/*.liquid',
          '**/*.scss'
        ],
        fn: function(event, file) {
          if (event === "change") {
            const bs = require('browser-sync').get('bs-webpack-plugin');
            bs.reload();
          }
        }
      }],
      // Move snippet injection to </body>,
      // Shopify content_for_header causes injection to load in head and break scripts
      snippetOptions: {
        rule: {
          match: /<\/body>/i,
          fn: function (snippet, match) {
            return snippet + match;
          }
        }
      }
    })
  ],
};