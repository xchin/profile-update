var ProvidePlugin = require('webpack').ProvidePlugin;
var path = require('path');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractCSS = new ExtractTextPlugin('style.css');


module.exports = {
    entry: [
        './js/app.js'
    ],
    devServer: {
        port: 8080,
        historyApiFallback: {
            index: '/'
        }
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: 'babel'
        }, {
            test: /\.html$/,
            loader: 'file?name=[name].[ext]'
        }, {
            test: /\.(jpe?g|png|gif)$/,
            exclude: /(node_modules)/,
            loader: 'url-loader?limit=10000'
        }, {
            test: /\.less$/,
            exclude: /(node_modules)/,
            loader: extractCSS.extract('style', 'css?sourceMap!postcss?sourceMap!less?sourceMap')
            // loader: extractCSS.extract('style', 'css!postcss!less')
        }, {
            test: /\.(ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }, {
            test: /\.(svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=65000&mimetype=image/svg+xml'
        }, {
            test: /\.(woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=65000&mimetype=application/font-woff'
        }, {
            test: /\.(woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=65000&mimetype=application/font-woff2'
        }, {
            test: /\.[ot]tf$/,
            loader: 'url-loader?limit=65000&mimetype=application/octet-stream'
        }, {
            test: /\.(eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject'
        }]
    },
    postcss: function() {
        return [autoprefixer];
    },
    plugins: [
        new ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": 'jquery',
            "windows.jQuery": 'jquery',
        }),
        extractCSS
    ],
    resolve: {
        extensions: ['', '.js', '.css'],
        alias: {
            "scrollTo": path.resolve(
                __dirname,
                "node_modules/jquery.scrollto/jquery.scrollTo.min"
            ),
            "waypoints": path.resolve(
                __dirname,
                "node_modules/waypoints/lib/jquery.waypoints.min"
            ),
        }
    }
};
