module.exports = {
  purge: [
    './theme/**/*.liquid',
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
