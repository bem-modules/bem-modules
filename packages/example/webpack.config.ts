import path from 'path';
import {Configuration} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const config: Configuration = {
    mode: 'development',
    devtool: false,
    entry: './src/index.ts',

    output: {
        filename: 'index.js',
        path: path.resolve('./lib'),
        libraryTarget: 'commonjs2',
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-typescript'],
                },
                exclude: /node_modules/,
            },
            {
                test: /\.bem\.css$/,
                use: [
                    {
                        loader: '@bem-modules/loader',
                    },
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '/',
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                ],
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'index.css',
        }),
    ],
};

export = config;
