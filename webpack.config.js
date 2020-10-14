const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const config = {
	entry: {
		index: {import: path.join(__dirname, 'src', 'index.js')}
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].bundle.js',
	},
	module: {
		rules: [
			{test: require.resolve('jquery'), loader: 'expose-loader', options: {exposes: ['$', 'jQuery']}},
			{test: /\.css$/, use: ['style-loader', {loader: 'css-loader', options: {importLoaders: 1}}, 'postcss-loader']},
			{test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
			{test: /\.png$/, use: [{loader: 'url-loader', options: {mimetype: 'image/png'}}]},
			{test: /\.pug$/, loader: 'pug-loader', options: {pretty: false}},
			{test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
			{test: /\.svg$/, use: 'file-loader'}
		]
	},
	devServer: {
		compress: true,
		contentBase: path.join(__dirname, 'dist'),
		port: 3000,
		stats: 'errors-only'
	},
	devtool: 'eval-cheap-module-source-map',
	optimization: {
		splitChunks: {
			chunks: 'all'
		}
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.join(__dirname, 'src', 'pages', 'index.pug')
		}),
		new CleanWebpackPlugin()
	]
};

module.exports = config;
