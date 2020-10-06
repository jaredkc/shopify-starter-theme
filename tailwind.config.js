module.exports = {
  purge: [
    './theme/**/*.liquid',
    './src/**/*.vue',
    './src/**/*.svelte',
  ],
  corePlugins: {
    preflight: false,
  },
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
};
