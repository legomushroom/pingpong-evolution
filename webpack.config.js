const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');

module.exports = {
  entry: ['./src/index.ts'],
  node: {
      fs: 'empty'
  },
  output: {
      path: path.join(__dirname, 'dist/'),
      filename: 'bundle.js'
  },
  resolve: {
      extensions: [ '.ts', '.tsx'],
      // alias: getAlias(),
      modules: ['src', 'node_modules']
  },
  plugins: [
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true
    }),
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({})
  ],
  module: {
      rules: [
          { test: /\.css$/,
              loader: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use: [
                      {
                        loader: 'typings-for-css-modules-loader',
                        query: {
                          sourceMap: true,
                          importLoaders: true,
                          silent: true,
                          namedExport: true
                        }
                      },
                      'postcss-loader'
                  ]
              })
          },
          {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: [
                  {
                    loader: 'typings-for-css-modules-loader',
                    query: {
                        sourceMap: true,
                        modules: true,
                        importLoaders: true,
                        namedExport: true,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                  },
                'postcss-loader',
                 'sass-loader'
              ]
            })
          }, {
          test: /\.tsx?$/,
          loaders: [ 'ts-loader' ],
          include: __dirname
        }
      ]
  },
  stats: {
      children: false
  }
};