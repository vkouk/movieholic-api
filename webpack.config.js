const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
  entry: ['webpack/hot/poll?1000', './src/server'],
  watch: true,
  devtool: 'sourcemap',
  target: 'node',
  node: {
    __filename: true,
    __dirname: true
  },
  externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
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
                plugins: ['transform-regenerator', 'transform-runtime']
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new StartServerPlugin('server.js'),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': { BUILD_TARGET: JSON.stringify('server') },
        'process.env.mongoURI': JSON.stringify(process.env.mongoURI),
        'process.env.REDIS_URL': JSON.stringify(process.env.REDIS_URL),
        'process.env.cookieKey': JSON.stringify(process.env.cookieKey),
        'process.env.jwtKey': JSON.stringify(process.env.jwtKey),
        'process.env.omdbApi': JSON.stringify(process.env.omdbApi)
      }),
      new webpack.BannerPlugin({ banner: 'require("source-map-support").install();', raw: true, entryOnly: false })
    ],
    output: { path: path.join(__dirname, 'dist'), filename: 'server.js' }
};