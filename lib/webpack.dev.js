const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseConfig = require('./webpack.config');
const projectRoot = process.cwd();

const devConfig = {
    mode: 'development',
    output: {
        path: path.join(projectRoot, 'dist'),
        filename: 'dist.js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(projectRoot, 'src/index.html'),
			inject: 'body'
		})
    ],
    devServer: {
        contentBase: path.resolve(projectRoot, 'dist'),
        hot: true
    },
    devtool: 'source-map'
};

module.exports = merge(baseConfig, devConfig);