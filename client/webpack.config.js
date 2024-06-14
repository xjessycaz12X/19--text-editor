const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },
    output: {
      filename: '[name]bundle.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Text Editor PWA',
      }),
      new InjectManifest({
        swSrc: './src-sw.js',
      }),
      new WebpackPwaManifest({
        fingerprints: false, // won't generate a random hash after the file name
        inject: true,
        name: 'Text Editor Progressive Web App',
        short_name: 'Text Editor PWA',
        description: 'An app that allows you to create code snippets or notes without an internet connection',
        background_color: '#7eb4e2',
        theme_color: "#7eb4e2",
        orientation: 'portrait',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 144, 192, 256, 384, 512],
            destination: path.join('assets', 'icons')
          }
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules|src-sw.js/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },
      ],
    },
  };