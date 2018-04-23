const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: ['./public/src/index.js'],
  output: {
    filename: 'addon.js',
    path: path.resolve(__dirname, 'public/build')
  },
  plugins: [
    new CleanWebpackPlugin(['public/build']),
    new ExtractTextPlugin('addon.css')
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react']
        }
      }
    },
    {
      test: /\.(jpg|png|svg)$/,
      loader: 'url-loader',
    },
    {
      test: /\.(woff|woff2|ttf|eot)$/,
      use: [{
        loader: 'url-loader',
      }]
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }]
  }
}