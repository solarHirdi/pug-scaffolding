const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const rupture = require('rupture');

const isProduction = process.env.NODE_ENV === 'production';
const PATHS = {
	app: path.join(__dirname, 'app'),
	dist: path.join(__dirname, 'dist')
}
const cssProd = ExtractTextPlugin.extract({
	fallback: 'style-loader',
	use: ['css-loader', 'stylus-loader', 'postcss-loader']

});
const cssDev = ['style-loader','css-loader', 'stylus-loader', 'postcss-loader'];
const cssConfig = isProduction ? cssProd : cssDev;

module.exports = {
	entry: {
		index: PATHS.app + '/pages/index.js',
	},
	output: {
		path: PATHS.dist,
		filename: '[name].js'
	},
	module: {
		rules: [{
			test: /\.pug$/,
			loader: 'pug-loader',
			options: {
				pretty: isProduction
			}
		}, {
			test: /\.styl$/,
			loader: cssConfig
		}, {
			test: /\.scss$/,
			loader: ['style-loader','css-loader', 'sass-loader']
		}, {
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		}, {
		// 	test: /\.svg$/,
		// 	exclude: /backgrounds/,
		// 	use: [{
		// 		loader: 'svg-sprite-loader',
		// 		options: {
		// 			extract: true,
		// 			spriteFilename: 'assets/icons.svg'
		// 		}
		// 	}]
		// }, {
		// 	test: /\.svg$/,
		// 	use: 'url-loader?encoding=url',
		// 	exclude: /icons/
		// }, {
			test: /\.(jpe?g|png|gif|svg)$/i,
			use: 'file-loader?name=[name].[ext]&outputPath=content/',
			exclude: /images/
		}, {
			test: /\.(jpe?g|png|gif)$/i,
			use: 'file-loader?name=[name].[ext]&outputPath=assets/images/&publicPath=../',
			exclude: /content/
		}, {
			test: /\.otf$/,
			use: 'file-loader?name=[name].[ext]&outputPath=assets/fonts/&publicPath=../'
		}, {
			test: /\.ico$/,
			use: 'file-loader?name=[name].[ext]',
		}, {
			test: /\.json$/,
			loader: 'json-loader'
		}]
	},
	devServer: {
		contentBase: PATHS.dist,
		compress: true,
		hot: true,
		port: 8080,
		stats: 'errors-only'
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Index Page',
			filename: 'index.html',
			chunks: ['index'],
			template: PATHS.app + '/pages/index.pug'
		}),
		// new SpriteLoaderPlugin(),
		new ExtractTextPlugin({
			filename: 'assets/app.css',
			disable: !isProduction,
			allChunks: true
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.LoaderOptionsPlugin({
			options: {
				stylus: {
					use: [require('rupture')()],
					import: ['~rupture/rupture/index.styl']
				}
			}
		})
	]
};
