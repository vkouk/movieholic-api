const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: ['./src/server'],
  devtool: 'sourcemap',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [['env', { modules: false }], 'stage-0'],
              plugins: ['transform-regenerator', 'transform-runtime', 'transform-object-rest-spread']
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  output: { path: path.join(__dirname, 'dist'), filename: 'server.js' }
};
