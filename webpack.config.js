/* eslint-env node */
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = { production: false }) => ({
  mode: env.production ? 'production' : 'development',
  entry: [
    'core-js/modules/es.promise',
    'core-js/modules/es.array.iterator',
    env.production
      ? path.resolve(__dirname, 'src', 'index.js')
      : path.resolve(__dirname, 'example', 'index.js'),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: env.production ? 'index.js' : '[id].[name].[fullhash].js',
  },
  resolve: {
    modules: [path.resolve('.', 'src'), path.resolve('.', 'node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/env',
              {
                modules: false,
                loose: true,
                useBuiltIns: 'usage',
                corejs: 3,
                targets: module ? { esmodules: true } : { browsers: '> 0.25%' },
              },
            ],
          ],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            '@babel/transform-runtime',
          ],
        },
      },
    ],
  },
  plugins: [
    env.production ? null : new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'example', 'index.template.html'),
    }),
  ].filter(Boolean),
  devtool: env.production ? 'source-map' : 'inline-source-map',
  devServer: env.production
    ? undefined
    : {
        overlay: true,
        hot: true,
        watchOptions: {
          ignored: /node_modules/,
        },
      },
});
// module.exports = (env = { production: false }) => ({
//   mode: env.production ?  'production' : 'development',
//   entry: [
//     "core-js/modules/es.promise",
//     "core-js/modules/es.array.iterator",
//     env.production
//     ? path.resolve(__dirname, 'src', 'index.js')
//     : path.resolve(__dirname, 'example', 'index.js')
//   ],
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: env.production ? '[id].[name].[hash].js' : 'index.js',
//   },
//   resolve: {
//     modules: [path.resolve('.', 'src'), path.resolve('.', 'node_modules')],
//   },
//   module: {
//     rules: [
//       { test: /\.js$/i, exclude: /node_modules/, loader: "babel-loader",
//         options: {
//           presets: [
//             [
//               '@babel/env',
//               {
//                 modules: false,
//                 loose: true,
//                 useBuiltIns: 'usage',
//                 corejs: 3,
//                 targets: (module)
//                   ? { esmodules: true }
//                   : { browsers: '> 0.25%' },
//               },
//             ],
//           ],
//           plugins: [
//             '@babel/plugin-syntax-dynamic-import',
//           ],
//         }
//       }
//     ]
//   },
//   plugins: [
//     env.production ? new webpack.optimize.ModuleConcatenationPlugin() : null,
//     // env.production
//     //   ? new (require('uglifyjs-webpack-plugin'))({
//     //       sourceMap: true,
//     //     })
//     //   : null,
//     env.production ? null : new webpack.HotModuleReplacementPlugin(),
//     env.production
//       ? null
//       : new HtmlWebpackPlugin({
//           template: path.join(__dirname, 'example', 'index.template.html'),
//         }),
//   ].filter(Boolean),
//   devtool: env.production ? 'source-map' : 'inline-source-map',
//   devServer: env.production
//     ? undefined
//     : {
//         overlay: true,
//         hot: true,
//         watchOptions: {
//           ignored: /node_modules/,
//         },
//       },
//
//   // optimization: {
//   //   minimizer: [
//   //     new (require('uglifyjs-webpack-plugin'))({
//   //       exclude: /\/excludes/,
//   //     }),
//   //   ],
//   // },
// });
