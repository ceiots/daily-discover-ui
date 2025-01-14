module.exports = function override(config, env) {
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
  };