const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimazerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

const htmlPageNames = ['index', 'inicio', 'learn'];
const multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: `./src/${name}.html`,
        filename: `${name}.html`, 
    })
});

module.exports = {
    mode: 'production',
    entry: {
        main: './src/main.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, './dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader, 'css-loader'
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: [
                    'url-loader'
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [new CssMinimazerPlugin({
            parallel: true
        }), new TerserPlugin({
            parallel: true
        })]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style.css',
        }),
    ].concat(multipleHtmlPlugins)
}