/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');

module.exports = (env = { dev: true }) => ({
  entry: env.dev
    ? path.resolve(__dirname, 'example', 'index.js')
    : path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: env.dev ? '[id].[name].[hash].js' : `${pkg.name}.js`,
  },
  resolve: {
    modules: [path.resolve('.', 'src'), path.resolve('.', 'node_modules')],
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/i,
  //       include: [
  //         path.resolve('src'),
  //       ],
  //       use: [
  //         {
  //           loader: 'babel-loader',
  //         },
  //       ],
  //     },
  //   ],
  // },
  plugins: [
    env.dev ? null : new webpack.optimize.ModuleConcatenationPlugin(),
    // env.dev
    //   ? null
    //   : new webpack.optimize.UglifyJsPlugin({
    //     parallel: true,
    //     sourceMap: true,
    //   }),
    env.dev ? new webpack.HotModuleReplacementPlugin() : null,
    env.dev
      ? new HtmlWebpackPlugin({
          template: path.join(__dirname, 'example', 'index.template.html'),
        })
      : null,
  ].filter(Boolean),
  devtool: env.dev ? 'inline-source-map' : 'source-map',
  devServer: env.dev
    ? {
        overlay: true,
        hot: true,
        watchOptions: {
          ignored: /node_modules/,
        },
      }
    : undefined,
});
