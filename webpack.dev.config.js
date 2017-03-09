var path = require('path');
var commonConfig = require('./webpack.common.config');

module.exports = Object.assign(commonConfig, {
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, './build/'),
        publicPath: 'http://localhost:8080/build/',
        filename: 'bundle.js'
    }
});
