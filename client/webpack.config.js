var ProvidePlugin = require("webpack")['ProvidePlugin'];
var path = require('path');

serve_path = path.resolve(__dirname, "../serve")

module.exports = {
    context: __dirname,
    entry: "./client_top.jsx",
    output: {
        publicPath: serve_path,
        path: serve_path,
        filename: "client.js",
    },
    module: {
        preLoaders: [],
        loaders: [
            {test: /\.json$/, loader: "json-loader"},
            {test: /\.coffee$/, loader: "coffee-loader"},
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.less$/, loader: "style-loader!css-loader!less-loader"},
            {test: /\.jade$/, loader: "jade-loader?self"},
            {test: /\.png$/, loader: "url-loader?prefix=img/"},
            {test: /\.jpg$/, loader: "url-loader?prefix=img/"},
            {test: /\.gif$/, loader: "url-loader?prefix=img/"},
            {test: /\.woff$/, loader: "url-loader?prefix=font/"},
            {test: /\.eot$/, loader: "file-loader?prefix=font/"},
            {test: /\.ttf$/, loader: "file-loader?prefix=font/"},
            {test: /\.svg$/, loader: "url-loader"},
            {test: /\.md$/, loader: "raw-loader"},
            {test: /\.wav$/, loader: "url-loader"},
            {test: /\.scss$/, loaders: ["style", "css", "sass"]},
            {test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/, query: {
                plugins: ['transform-class-properties', 'extensible-destructuring'],
                presets: ['es2015', 'react']}}],
    },
    amd: {jQuery: true},
    devtool: "#inline-source-map",
    plugins: [
        new ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            d3: "d3",
            _: "underscore"
        })
    ],
    resolve: {
        extensions: ["", ".jsx", ".js"],
        root: [
            path.resolve('./'),
        ]
    }
}