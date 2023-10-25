/* eslint-disable @typescript-eslint/no-var-requires, import/extensions */
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  plugins: [
    new Dotenv({
      path: './.env.prod',
    }),
  ],
});
