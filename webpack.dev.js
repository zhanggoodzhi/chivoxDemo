const path = require('path')
const root = __dirname
const HtmlWebpackPlugin = require('html-webpack-plugin');
const theme = {
    "primary-color": "#22bf7c"
};
module.exports = {
    // 入口文件
    entry: path.resolve(root, 'src/index.jsx'),
    // 出口文件
    output: {
        filename: 'bundle.js',
        path: path.resolve(root, 'public/dist'),
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.resolve('src/components'),
            path.resolve('src'),
            'node_modules'
        ],
    },
    // loaders
    module: {
        rules: [{
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
            }, {
                test: /\.(less|css)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', `less-loader?{"modifyVars":${JSON.stringify(theme)}}`],
            }, {
                test: /\.eot(\?.*)?$/,
                loader: 'file-loader?name=fonts/[hash].[ext]'
            },
            {
                test: /\.(woff|woff2)(\?.*)?$/,
                loader: 'file-loader?name=fonts/[hash].[ext]'
            },
            {
                test: /\.ttf(\?.*)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]'
            },
            {
                test: /\.svg(\?.*)?$/,
                loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'url-loader?limit=1000&name=assets/[name].[ext]'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(root, 'public'),
        historyApiFallback: true,
        port: 9000
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'React Demo',
            template: path.resolve(root, 'template.html')
        })
    ]
}