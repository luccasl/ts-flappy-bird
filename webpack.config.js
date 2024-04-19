const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/app.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    devtool: "eval-source-map",
    devServer: {
        static: "./dist",
        devMiddleware: {
            writeToDisk: true,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Javascript Flappy Bird",
            template: "template.html",
        }),
        new CopyPlugin({
            patterns: [{ from: "public" }],
        }),
    ],
};
