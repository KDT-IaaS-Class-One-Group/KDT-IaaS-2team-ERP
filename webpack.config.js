module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              config: { path: "./postcss.config.js" },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
};