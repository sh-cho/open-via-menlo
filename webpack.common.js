/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require('child_process');
const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    popup: path.resolve('src/popup/popup.tsx'),
    options: path.resolve('src/options/options.tsx'),
    background: path.resolve('src/background/background.ts'),
    contentScript: path.resolve('src/contentScript/contentScript.ts'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules|.yarn/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('src/static'),
          to: path.resolve('dist'),
        },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
    }),
    new webpack.EnvironmentPlugin({
      STAGE: JSON.stringify(process.env.stage) || 'dev',
      VERSION: process.env.npm_package_version,
      COMMIT_HASH: childProcess
        .execSync('git rev-parse --short HEAD')
        .toString()
        .trim(),
      COMMIT_DATE: childProcess
        .execSync('git show -s --format=%ci')
        .toString()
        .trim(),
    }),
    ...getHtmlPlugins(['popup', 'options']),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
  },
  optimization: {
    splitChunks: {
      chunks(chunk) {
        return chunk.name !== 'contentScript' && chunk.name !== 'background';
      },
    },
  },
  experiments: {
    topLevelAwait: true,
  },
};

function getHtmlPlugins(chunks) {
  return chunks.map(
    (chunk) =>
      new HtmlPlugin({
        title: 'Open-via-menlo options',
        filename: `${chunk}.html`,
        chunks: [chunk],
      }),
  );
}
