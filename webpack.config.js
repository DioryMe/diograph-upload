var webpack = require('webpack');

module.exports = {
  mode: "development",
  entry: "./app/index.tsx",
  output: {
    path: __dirname + "/dist",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [ { loader: "ts-loader" } ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'DIOGRAPH_SERVER_HOST': 'http://localhost:3000'
    })
  ],
  // Example taken from https://medium.com/code-oil/burning-questions-with-answers-to-why-webpack-dev-server-live-reload-does-not-work-6d6390277920
  devServer: {
    publicPath: '/',
    contentBase: "dist",
    watchContentBase: true,
    compress: true,
    port: 4204
  }
};
