var path = require('path');
var commonConfig = require('./webpack.common.config');

module.exports = Object.assign(commonConfig, {
    output: {
        path: path.join(__dirname, './build/'),
        publicPath: 'http://www.ctgrill.com/build/',
        filename: 'bundle.js'
    }
});
