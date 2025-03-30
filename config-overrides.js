// ./config-overrides.js
/**
 * React App Rewired configuration
 * Adds support for server function comment markers
 */
const path = require('path');

module.exports = function override(config, env) {
  // Add the server marker loader
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: path.resolve(__dirname, './server-marker-loader.js'),
      }
    ]
  });

  // Add Node.js polyfills for client-side
  config.resolve = config.resolve || {};
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "os": false,
    "path": false,
    "vm": false
  };

  return config;
};