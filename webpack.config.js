const path = require('path');
const read = require('read-yaml');
const BrowserSync = require('browser-sync');
// const glob = require('glob');

const config = read.sync('config.yml');
const themeID = config.development.theme_id;
const storeURL = config.development.store;
const devMode = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const PATHS = {
  assets: path.resolve(__dirname, 'theme/assets'),
  theme: path.join(__dirname, 'theme'),
};

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
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: { emitCss: true },
        },
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread'],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          devMode ? MiniCssExtractPlugin.loader : 'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  stats: { children: false },
  plugins: [
    // Extract CSS to external file for dev inspection
    new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),

    new BrowserSyncPlugin({
      https: true,
      port: 3000,
      proxy: `https://${storeURL}?preview_theme_id=${themeID}`,
      reloadDelay: 3000,
      middleware: [
        (function mw(req, res, next) {
          // Add url paramaters for Shopify theme preview.
          // ?_fd=0 prevents domain forwarding, ?pb=0 hides the Shopify preview bar
          const prefix = req.url.indexOf('?') > -1 ? '&' : '?';
          const queryStringComponents = ['_ab=0&_fd=0&_sc=1&pb=0'];
          req.url += prefix + queryStringComponents.join('&');
          next();
        }),
      ],
      files: [{
        match: [
          '**/*.liquid',
          '**/*.css',
        ],
        fn(event) {
          if (event === 'change') {
            const bs = BrowserSync.get('bs-webpack-plugin');
            bs.reload();
          }
        },
      }],
      // Move snippet injection to </body>,
      // Shopify content_for_header causes injection to load in head and break scripts
      snippetOptions: {
        rule: {
          match: /<\/body>/i,
          fn(snippet, match) {
            return snippet + match;
          },
        },
      },
    }),
  ],
};
