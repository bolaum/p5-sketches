const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./config.js');

const SKETCHES = config.compile;

const entry = {
  index: `${__dirname}/src/index.js`,
};

const plugins = [
  new webpack.ProvidePlugin({
    _: 'lodash',
  }),
  new CopyWebpackPlugin([{ from: 'src/assets', to: 'assets' }]),
  new HtmlWebpackPlugin({
    template: 'src/index.ejs',
    chunks: ['index'],
  }),
];

SKETCHES.forEach((sketch) => {
  entry[`${sketch}/${sketch}`] = `${__dirname}/src/${sketch}/index.js`;
  plugins.push(
    new HtmlWebpackPlugin({
      template: 'src/common/base.ejs',
      filename: `${sketch}/${sketch}.html`,
      chunks: [`${sketch}/${sketch}`],
    }),
  );
});

module.exports = {
  devtool: 'inline-sourcemap',
  entry,
  mode: 'development',
  output: {
    path: `${__dirname}/dist/`,
    publicPath: '/',
    filename: '[name].js',
  },
  devServer: {
    contentBase: 'src/',
    watchContentBase: true,
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
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
      },
      {
        test: /\.md$/,
        use: ['raw-loader'],
      },
    ],
  },
  plugins,
  externals: {
    lodash: '_',
    jquery: '$',
    showdown: 'showdown',
    p5: 'p5',
    'p5/lib/addons/p5.dom': 'p5.dom',
    'p5/lib/addons/p5.sound': 'p5.sound',
  },
};
