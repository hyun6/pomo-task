//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const Obfuscator = require('webpack-obfuscator');

module.exports = function (config) {
  return {
    ...config,
    plugins: [
      ...config.plugins,
      /*new BundleAnalyzerPlugin(),*/ config.mode === 'production' && new Obfuscator(),
    ].filter(Boolean),
    devtool: false,
  };
};
