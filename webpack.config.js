var path = require('path');
var commonConfig = require('./webpack.common.config');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractCSS = new ExtractTextPlugin('style.css');

var output = {
    path: path.resolve(__dirname, 'build'),
    publicPath: 'http://www.ctgrill.com/build/',
    filename: 'bundle.js'
};

module.exports = Object.assign(commonConfig, {
    output: output,
    module: {
        loaders: commonConfig.module.loaders.concat({
            test: /\.less$/,
            exclude: /(node_modules)/,
            loader: extractCSS.extract('style', 'css!postcss!less')
        })
    },
    plugins: commonConfig.plugins.concat(extractCSS)
});
