const path = require('path');
const fs = require('fs');
const { HotModuleReplacementPlugin, ProvidePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: path.resolve(__dirname, './src'),
  dist: path.resolve(__dirname, './dist'),
  pages: path.resolve(__dirname, './src/html'),
};

const HTML_PAGES = fs.readdirSync(PATHS.pages).filter((fileName) => fileName.endsWith('.html'));
const INJECT_STYLES = true;
const IS_DEV = process.env.NODE_ENV !== "production";

/**
 * Base config
 */
const config = {
  entry: [`${PATHS.src}/js`, `${PATHS.src}/sass/main.sass`],
  output: {
    filename: INJECT_STYLES ? './js/[name].[hash].js' : './js/[name].js',
    path: PATHS.dist,
    // publicPath: '/'
  },
  devServer: IS_DEV ? {
    host: '0.0.0.0',
    port: 9090,
    contentBase: ['./dist', './src/html', './src/html/includes'],
    watchContentBase: true,
    hot: true,
    inline: true,
    overlay: {
      warnings: true,
      errors: true,
    }
  } : {},
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/,
        include: `${PATHS.pages}/includes`,
        use: {
          loader: 'html-loader',
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        }
      },
      {
        test: /\.sass|scss$/,
        exclude: /node_modules/,
        use: [
          IS_DEV ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader'
          },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jp(e)?g|gif|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        include: path.resolve(__dirname, `./src/img`),
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'libs',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  // resolve: {
  //   alias: {
  //     '~': 'src',
  //   },
  // },
  plugins: [
    //dev
    IS_DEV && new HotModuleReplacementPlugin(),
    ...HTML_PAGES.map(page => {
        return new HtmlWebpackPlugin({
          template: `${PATHS.pages}/${page}`,
          filename: page,
          inject: INJECT_STYLES
        });
      }
    ),
    new MiniCssExtractPlugin({
      filename: INJECT_STYLES ? './css/[name].[contenthash].css' : './css/[name].css'
    }),
    new CopyWebpackPlugin([
      {
        from: `${PATHS.src}/static`,
        to: ''
      },
    ]),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
  ],
};


module.exports = (env, argv) => {
  if(argv.mode === "development") {
  } else if(argv.mode === "production") {
  }

  return config;
};