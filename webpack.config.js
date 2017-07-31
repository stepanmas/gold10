!function () {
    "use strict";

    const webpack           = require('webpack');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const path              = require('path');
    const CopyWebpackPlugin = require('copy-webpack-plugin');

    const BUILD_DIR = path.resolve(__dirname, 'public');
    const APP_DIR   = path.resolve(__dirname, 'src/frontend');
    const BACK_DIR  = path.resolve(__dirname, 'src/backend');

    let config = {
        context: APP_DIR,

        entry : APP_DIR + '/index.js',
        output: {
            path      : BUILD_DIR,
            filename  : 'bundle.js',
            library   : "[name]",
            publicPath: '/'
        },

        module: {
            loaders: [
                {
                    test   : /\.js?/,
                    include: APP_DIR,
                    loader : "babel-loader",
                    options: {
                        plugins: ['transform-runtime']
                    }
                },
                {
                    test  : /\.css$/,
                    loader: 'style-loader!css-loader!postcss-loader?browsers=last 2 version'
                },
                {
                    test  : /\.less$/,
                    loader: 'style-loader!css-loader!less-loader?resolve url'
                },
                {
                    test  : /\.(png|gif|jpg|svg|ttf|eot|woff|woff2)$/,
                    loader: 'url-loader?name=[path][name].[ext]?[hash]&limit=4096'
                },

                {
                    test  : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader?limit=10000&mimetype=application/font-woff"
                },
                {
                    test  : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "file-loader"
                }
            ]
        },

        plugins: [
            new CopyWebpackPlugin(
                [
                    {
                        context: 'favicons',
                        from   : '**/*',
                        to     : BUILD_DIR
                    },
                    {
                        context: 'modules',
                        from   : '**/*.html',
                        to     : BUILD_DIR
                    }
                ]
            ),

            new webpack.SourceMapDevToolPlugin(
                {
                    filename: '[file].map',
                    exclude : [
                        /vendor\/.+\.js/,
                        /node_modules\/.+\.js/,
                        'index.js'
                    ]
                }
            ),

            new webpack.HotModuleReplacementPlugin(),

            new HtmlWebpackPlugin(
                {
                    hash    : true,
                    filename: 'index.html',
                    template: path.resolve(BACK_DIR, 'index.html')
                }
            ),

            new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/)
        ],

        resolve: {
            modules   : [
                path.resolve('src/frontend/modules'),
                path.resolve('node_modules')
            ],
            extensions: [".js"],

            alias: {
                moment: 'moment/moment',
            }
        },

        resolveLoader: {
            modules        : ["node_modules"],
            extensions     : [".js"]
        },

        devServer: {
            host              : 'localhost',
            port              : 8090,
            contentBase       : BUILD_DIR,
            //outputPath        : BUILD_DIR,
            hot               : true,
            historyApiFallback: true,

            proxy: {
                '/api'      : {
                    target: 'http://127.0.0.1:3001',
                    secure: false
                },
                '/socket.io': {
                    target: 'http://127.0.0.1:3001',
                    secure: false
                }
            }
        }
    };

    module.exports = config;
}()