const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Los .svg se importan como componentes (react-native-svg-transformer), no como imágenes
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = config;
