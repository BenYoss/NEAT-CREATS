const path = require('path');

module.exports = {
  mode: 'production',
  // watch: true,
  entry: path.resolve('./client/src/Index.jsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve('./client/dist'),
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        // node modules should be excluded to prevent regenerator-runtime error.
        exclude: /node_modules/,
        // loader helps with additional details on a particular loader.
        // options can then be used to specify options for the loader
        // instead of making a separate loader file.
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
        },
      },
      {
        test: /\.(s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        // gltf loader helps with rendering WebGL's gltf object files.
        test: /\.(gltf)$/,
        use: [
          {
            loader: 'gltf-webpack-loader',
          },
        ],
      },
      {
        // this helps with the loading of files and with the file loader.
        test: /\.(png|svg|jpg|gif|bin|jpeg|wav|mp3|eot|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.sass'],
  },
};
