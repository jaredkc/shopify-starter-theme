# Shopify Starter Theme

A Shopify 2.0 starter theme that focuses on performance, user experience, and developer experience.

## Development

1. [Getting started with Shopify CLI](https://shopify.dev/themes/tools/cli/getting-started)
2. [Shopify CLI commands for themes](https://shopify.dev/themes/tools/cli/commands)
3. Be familiar with the [directory structure of a Shopify theme](https://shopify.dev/themes/architecture#directory-structure-and-component-types).
4. Run `shopify theme dev` to start a local development. This uploads the current theme to a store so you can preview it. The first time you run shopify cli, or anytime you switch stores, you must pass the `--store` parameter.
5. In another terminal window, run `npm run dev` to build TailwindCSS styles. Before deploying to production, run `npm run build` to minify and optimize TailwindCSS styles.

```bash
shopify theme dev --store=mystore.myshopify.com
```
