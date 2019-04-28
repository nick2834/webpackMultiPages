const path = require('path');
const webpack = require('webpack');
const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const root = path.resolve(__dirname, '../')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function entries() {
    // let jsDir = './src/js/lib'
    let jsDir = path.resolve(__dirname, '../src/page')
    let entryFiles = glob.sync(jsDir + '/**/*.js')
    let map = {};

    for (let i = 0; i < entryFiles.length; i++) {
        let filePath = entryFiles[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    return map;
}

function newHtmlWebpackPlugins() {
    let jsDir = path.resolve(__dirname, '../src/page')
    let htmls = glob.sync(jsDir + '/**/*.html')
    let plugins = []

    for (let i = 0; i < htmls.length; i++) {
        let filePath = htmls[i];
        let filename_no_extension = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let filename = filename_no_extension.concat('.html')
        plugins.push(new HtmlWebpackPlugin({
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            filename: filename,
            template: filePath,
            chunks: [filename_no_extension],
        }))
    }

    return plugins
}

module.exports = {
    entry: entries(),
    output: {
        filename: 'js/[name]/[name].[hash].js',
        path: path.resolve(__dirname, '../dist')
    },
    module: {
        rules: [{
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                include: path.resolve(__dirname, '../src')
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!less-loader"
                })

            },
            {
                test: /\.(jpg|jpeg|png|svg|gif)$/,
                use: [
                    'url-loader?limit=8192&name=images/[name].[hash:8].[ext]'
                ]
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            },
            {
                test: /\.(woff|woff2)$/,
                loader: "url?prefix=font/&limit=5000"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery",
            "window.$": "jquery",
        }),
        new CleanWebpackPlugin(['dist'], {
            root: root,
        }),
        new ExtractTextPlugin("css/[name]/[name].[hash:8].css"),
        ...newHtmlWebpackPlugins()
    ]
}