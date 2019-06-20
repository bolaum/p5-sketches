// const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const sketches = [
  'dots',
  'mic',
];

const plugins = [
  new CopyWebpackPlugin([
    { from: 'src/assets', to: 'assets' },
  ]),
  new HtmlWebpackPlugin({
    template: 'src/index.ejs',
    chunks: ['index'],
  }),
];

const entry = {
  index: `${__dirname}/src/index.js`,
};

sketches.forEach((sketch) => {
  entry[`${sketch}/${sketch}`] = `${__dirname}/src/${sketch}/index.js`;
  plugins.push(new HtmlWebpackPlugin({
    template: 'src/common/base.ejs',
    filename: `${sketch}/${sketch}.html`,
    chunks: [`${sketch}/${sketch}`],
  }));
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
        loader: 'style-loader!css-loader!sass-loader',
      },
    ],
  },
  plugins,
  externals: {
    _: 'lodash',
    p5: 'p5',
    'p5/lib/addons/p5.dom': 'p5.dom',
    'p5/lib/addons/p5.sound': 'p5.sound',
  },
};
