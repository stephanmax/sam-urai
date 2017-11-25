const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PATHS = {
  SRC: path.resolve(__dirname, 'src'),
  DIST: path.resolve(__dirname, 'dist'),
  PHASERMODULE: path.resolve(__dirname, 'node_modules', 'phaser-ce')
}

PATHS.PHASER = path.join(PATHS.PHASERMODULE, 'build/custom/phaser-split.js')
PATHS.PIXI = path.join(PATHS.PHASERMODULE, 'build/custom/pixi.js'),
PATHS.P2 =  path.join(PATHS.PHASERMODULE, 'build/custom/p2.js')

module.exports = {
  entry: {
    game: [path.join(PATHS.SRC, 'main.js')],
    vendor: ['pixi', 'p2', 'phaser']
  },
  output: {
    path: PATHS.DIST,
    filename: 'game.bundle.js'
  },
  devServer: {
    contentBase: PATHS.SRC
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'/* chunkName= */,
      filename: 'vendor.bundle.js'/* filename= */
    }),
    new HtmlWebpackPlugin({
      template: path.join(PATHS.SRC, 'index.html')
    }),
    new CopyWebpackPlugin([{
      from: path.join(PATHS.SRC, 'assets'),
      to: path.join(PATHS.DIST, 'assets')
    }, {
      from: 'CNAME',
      to: path.join(PATHS.DIST)
    }], {})    
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }]
    }, {
      test: /pixi\.js/,
      use: ['expose-loader?PIXI']
    }, {
      test: /phaser-split\.js$/,
      use: ['expose-loader?Phaser']
    }, {
      test: /p2\.js/,
      use: ['expose-loader?p2']
    }]
  },
  resolve: {
    alias: {
      'phaser': PATHS.PHASER,
      'pixi': PATHS.PIXI,
      'p2': PATHS.P2
    },
    extensions: ['.js']
  }
}
