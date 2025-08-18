# Shopify Starter Theme

> [!NOTE]
> This is a work in progress. An archive for the Shopify 1.0 starter theme is available in the `1.0-theme-archive` branch.

A Shopify 2.0 starter theme that focuses on performance, user experience, and simplicity.

- Everything is intentionally basic. So you can focus on building what you need without the hassle of complex settings and functionality you don’t.
- For CSS, you will find a combination of TailwindCSS and traditional stylesheets. If something is used throughout the theme, standard CSS is used for consistency.
- I have included solutions I have found helpful across multiple Shopify themes, many of which may be unique and useful.
- English string translations for customer-facing content are included in the `locales` directory.

## Development

*Prerequisites:* Install [Node](https://nodejs.org) (NPM used for TailwindCSS) and [Shopify CLI](https://shopify.dev/themes/tools/cli/installation)

1. Clone this repository and `cd` into the project directory.

2. Run `npm install` to install dependencies.

3. In the `package.json` file, enter your Shopify domain in the `shop:dev` script

      ```bash
      "shop:dev": "shopify theme dev --store=your-domain.myshopify.com",
      ```

4. Run `npm run dev` to start a local development.

      - This uploads the current theme to a store so you can preview it and keeps the TailwindCSS styles updated.
      - The first time you run Shopify CLI, or anytime you switch stores, you must pass the `--store` parameter.

5.  Before deploying to production, run `npm run build` to minify and optimize TailwindCSS styles.

References for Shopify theme development:

1. [Getting started with Shopify CLI](https://shopify.dev/themes/tools/cli/getting-started)
2. [Shopify CLI commands for themes](https://shopify.dev/themes/tools/cli/commands)
3. Be familiar with the [directory structure of a Shopify theme](https://shopify.dev/themes/architecture#directory-structure-and-component-types).

