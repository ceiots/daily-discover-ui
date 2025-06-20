/* eslint-env node */
const { override, addBabelPlugin } = require('customize-cra');

module.exports = override(
  addBabelPlugin('babel-plugin-styled-components'),
  (config, env) => {
    if (env === 'development') {
      config.devServer = {
        ...config.devServer,
        setupMiddlewares: (middlewares, devServer) => {
          // 你可以在这里添加中间件
          return middlewares;
        },
      };
    }
    return config;
  }
);