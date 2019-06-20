// const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  // devtool: 'inline-sourcemap',
  entry: `${__dirname}/src/js/main.js`,
  mode: 'development',
  output: {
    path: `${__dirname}/dist/`,
    publicPath: '/',
    filename: 'js/sketch.js',
  },
  devServer: {
    inline: true,
    hot: true,
    port: 3333,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/index.html', to: 'index.html' },
      { from: 'src/assets', to: 'assets' },
    ]),
  ],
  externals: {
    _: 'lodash',
    p5: 'p5',
    'p5/lib/addons/p5.dom': 'p5.dom',
    'p5/lib/addons/p5.sound': 'p5.sound',
  },
};
