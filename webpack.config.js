const path    = require('path');

const webpack = require("webpack");

const ExtractTextPlugin   = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin   = require("html-webpack-plugin");
const I18nPlugin          = require("i18n-webpack-plugin");
const Clean               = require('clean-webpack-plugin');

const Autoprefixer        = require('autoprefixer');
const Stylelint           = require('stylelint');
const BrowserReporter     = require('postcss-browser-reporter');
const SimpleVars          = require('postcss-simple-vars');
const atImport            = require('postcss-import');

const languages = {
	"en": require(path.join(__dirname, 'src/langs/en.json'))
};

const isProduction = process.env.NODE_ENV === 'production';


var options = {
	context: path.join(__dirname, 'src'),
	entry:{
		app: ['./app.js'],
		common: [
			'react',
			'react-router',
			'react-dom',
			'react-addons-pure-render-mixin',
			'react-tap-event-plugin',
			'flux',
			'history',
			'classnames',
			'immutable'
		]
	},
	resolve: {
		extensions: ['', '.jsx', '.js']
	},
	output: {
		path: path.join(__dirname, isProduction ? 'docs' : 'build'),
		filename: "editor.js"
	},
	watch: !isProduction,
	module: {
		preLoaders: [
			{
				test: /\.js|.jsx$/,
				exclude: /node_modules\/(?!gf_components).*|third-party/,
				loader: "eslint-loader"
			},
			{
				test: /\.css$/,
				exclude: /node_modules\/(?!gf_components).*|third-party/,
				loader: "postcss-loader"
			}
		],
		loaders: [
			{
				test: /\.css$/,
				exclude: /node_modules\/(?!gf_components).*/,
				loader: ExtractTextPlugin.extract('style-loader', 'css-loader?'+(!isProduction ? 'localIdentName=[name]--[local]--[hash:base64]&' : 'localIdentName=[hash:base64:3]&')+'&'+(isProduction ? 'minimize' : 'sourceMap')+'!postcss-loader')
			},
			{
				test: /\.js|.jsx?$/,
				exclude: /node_modules\/(?!gf_components).*/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				exclude: /node_modules/,
				loader: "url-loader?limit=10000&minetype=application/font-woff&name=[path][name].[ext]"
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				exclude: /node_modules/,
				loader: "file-loader?name=[path][name].[ext]"
			},
			{
				test: /\.(png|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				exclude: /node_modules\/(?!gf_components).*/,
				loader: "url-loader?limit=5000&name=[path][name].[ext]"
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('application.css'),
		new webpack.optimize.DedupePlugin(),
		new I18nPlugin(
			languages['en']
		),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),
		new webpack.optimize.CommonsChunkPlugin('common', 'common.js'),
		new webpack.optimize.UglifyJsPlugin({minimize: true, compress: {warnings: false}}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'src/index.html'
		}),
		new Clean(['build'])
	],
	debug: !isProduction,

	devServer:{
		host: '0.0.0.0',
		port: '8088',
		https: true,
		contentBase: path.join(__dirname, 'src'),
		hot: true
	},

	eslint: {
		emitError: true,
		failOnError: true,
		quiet: true
	},

	postcss: function () { //Stylelint(),
		return [atImport, SimpleVars, Autoprefixer, BrowserReporter];
	}
};

if(!isProduction){
	options.devtool = 'eval'; // for style debug 'inline-source-map'
}

module.exports = options;