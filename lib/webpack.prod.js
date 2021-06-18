const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config');
const projectRoot = process.cwd();

const prodConfig = {
    mode: 'development',
    output: {
        filename: 'lightEditor.min.js',
        path: path.resolve(projectRoot, 'dist'),
        publicPath: '/dist/',
        library: 'lightEditor',
        libraryTarget: 'umd'
    }   
};

module.exports = merge(baseConfig, prodConfig);