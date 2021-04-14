# Shopify Starter Theme

A Shopify starter theme, complete with local development setup utilizing [Shopify Theme Kit](https://shopify.github.io/).

A bit of what this starter theme is utilizing:
[Webpack](https://webpack.js.org/),
[Babel](https://babeljs.io/),
[Browsersync](https://browsersync.io/),
[Lazysizes](https://github.com/aFarkas/lazysizes),
[Svelte](https://svelte.dev/),
[ESLint](https://eslint.org/),
[PostCSS](https://postcss.org/),
[TailwindCSS](https://tailwindcss.com/),
[PurgeCSS](https://purgecss.com/),
[Material Design Icons](https://google.github.io/material-design-icons/#icon-font-for-the-web),
[Stylelint](https://stylelint.io/)

## Quick Start

1. [Setup Shopify Theme Kit](https://shopify.github.io/themekit/)
    - If you are new to Theme Kit be sure to follow the steps for [Installation](https://shopify.github.io/themekit/#installation), [Get API Access](https://shopify.github.io/themekit/#get-api-access). Then [Create a new theme](https://shopify.github.io/themekit/#create-a-new-theme) or [Configure an existing theme](https://shopify.github.io/themekit/#configure-an-existing-theme).
2. Add [config file](https://shopify.github.io/themekit/configuration/) (config.yml) for your Shopify theme(s)
3. From project directory run `npm install`

### Example config.yml

Note: you can find your `theme_id` at this URL for your Shopify store: `https://yourstore.myshopify.com/admin/themes.xml`

```yml
development:
  password: 0987654321098765432109876543210
  theme_id: 0987654321
  store: yourstore.myshopify.com
production:
  password: 1234567890123456789012345678901
  theme_id: 1234567890
  store: yourstore.myshopify.com
  ignore_files:
    - settings_data.json
```

## Local Development

I'll run both of these same time, in two different Terminal windows.

1. `npm run watch:theme`, to start a process that will watch your directory for changes and upload them to Shopify
2. `npm run watch:assets`, to start [Browersync](https://browsersync.io/) and build scripts and styles.

### Theme Check

[Theme Check](https://github.com/Shopify/theme-check) is a linter for themes.
In order to run it you first need to install it through HomeBrew or RubyGems.
Also useful is the [VSCode Theme Check](https://marketplace.visualstudio.com/items?itemName=Shopify.theme-check-vscode) extension.

```
# Install via HomeBrew
brew tap shopify/shopify
brew install theme-check
# Run it
npm run theme-check
```

## Structure

- `src/`: JavaScript and CSS source files are compiled from here and added to `theme/assets/`.
- `theme/`: Shopify ready theme files that are uploaded with Shopify Theme Kit.
- `config.yml`: Contains the information needed for Shopify to authenticate requests and edit/update remote theme files.

## Reference

- Lazy, or on-demand, loading for JavaScript modules with Webpack. [Learn more](https://webpack.js.org/guides/lazy-loading/).
