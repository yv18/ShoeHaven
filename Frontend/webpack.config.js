const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      app: './SRC/App.jsx',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'public'),
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(jpe?g|png|gif|svg|ico)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'img/',
              },
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      ie: '11',
                      edge: '15',
                      safari: '10',
                      firefox: '50',
                      chrome: '49',
                    },
                  },
                ],
                '@babel/preset-react',
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      },
      minimize: isProduction,
      minimizer: [new TerserPlugin()],
    },
    plugins: [
      new webpack.DefinePlugin({
        __isBrowser__: 'true',
      }),
      // Only include the BundleAnalyzerPlugin in production mode
      ...(isProduction ? [new BundleAnalyzerPlugin()] : []),
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
};
