const path = require('path');

module.exports = {
  mode: 'production',
  watch: true,
  entry: path.resolve('./client/src/Index.jsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve('./client/dist'),
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['css-loader', 'style-loader', 'sass-loader'],
      },
    ],
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.sass'],
  },
};
