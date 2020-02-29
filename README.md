# Shopify Starter Theme

A Shopify starter theme using [Shopify Theme Kit](https://shopify.github.io/) and [Webpack](https://webpack.js.org/) for local development.

Includes: Browsersync, Babel, Lazysizes, Sass, PurgeCSS, Vue

## Quick Start

1. [Setup Shopify Theme Kit](https://shopify.github.io/themekit/)
2. Add [config file](https://shopify.github.io/themekit/configuration/) (config.yml) for your Shopify theme(s)
3. From project directory run `npm install`

## Local Development

1. `npm run watch-theme`, to start a process that will watch your directory for changes and upload them to Shopify
2. `npm run watch`, to start [Browersync](https://browsersync.io/) and have your browser refresh as changes are saved

## Structure

- `src/`: JavaScript and Sass source files are compiled from here and added to `theme/assets/`.
- `theme/`: Shopify ready files that are uploaded using Shopify Theme Kit.
- `config.yml`: Contains the information needed for Shopify to authenticate requests and edit/update remote theme files.