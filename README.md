# Shopify Starter Theme

A Shopify starter theme, complete with local development setup utilizing [Shopify Theme Kit](https://shopify.github.io/).

Resources:
- [Webpack](https://webpack.js.org/)
- [Babel](https://babeljs.io/)
- [Browsersync](https://browsersync.io/)
- [PostCSS ](https://postcss.org/)
- [TailwindCSS ](https://tailwindcss.com/)
- [PurgeCSS](https://purgecss.com/)
- [Stylelint](https://stylelint.io/)
- [Lazysizes](https://github.com/aFarkas/lazysizes)
- [Svelte](https://svelte.dev/)
- [Material Design Icons](https://google.github.io/material-design-icons/#icon-font-for-the-web) for the web


## Quick Start

1. [Setup Shopify Theme Kit](https://shopify.github.io/themekit/)
2. Add [config file](https://shopify.github.io/themekit/configuration/) (config.yml) for your Shopify theme(s)
3. From project directory run `npm install`

Example config.yml:

```yml
development:
  password: 0987654321098765432109876543210
  theme_id: 0987654321
  store: yourstore.myshopify.com
production:
  password: 123456789012345678901`2345678901
  theme_id: 1234567890
  store: yourstore.myshopify.com
  ignore_files:
    - settings_data.json
```

## Local Development

1. `npm run watch-theme`, to start a process that will watch your directory for changes and upload them to Shopify
2. `npm run watch`, to start [Browersync](https://browsersync.io/) and have your browser refresh as changes are saved

## Structure

- `src/`: JavaScript and Sass source files are compiled from here and added to `theme/assets/`.
- `theme/`: Shopify ready theme files that are uploaded with Shopify Theme Kit.
- `config.yml`: Contains the information needed for Shopify to authenticate requests and edit/update remote theme files.