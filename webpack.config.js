/* eslint-disable arrow-body-style */
/* eslint-disable indent */
/* eslint-disable quotes */
const path = require('path');

const webpack = require("webpack");

const MiniCssExtractPlugin	= require('mini-css-extract-plugin');
const HtmlWebpackPlugin   	= require('html-webpack-plugin');
const {CleanWebpackPlugin}  = require('clean-webpack-plugin');
const CopyWebpackPlugin   	= require('copy-webpack-plugin');
const TerserPlugin 					= require('terser-webpack-plugin');
const ESLintPlugin 					= require('eslint-webpack-plugin');


const isProduction 	= process.env.NODE_ENV === 'production';
const baseURL 			= process.env.BASEURL || '';


const options = {
	context: path.join(__dirname, 'src'),
  entry:{
    index: './index.js'
  },

	output: {
    path: path.join(__dirname, isProduction ? 'docs' : 'build'),
    publicPath: `${baseURL}/`//,
		//filename: "editor.js"
  },
	
  resolve: {
	  extensions: ['.jsx', '.js'],
	  fallback: {
      stream: false,
    	crypto: false
    }
  },

	watch: !isProduction,

	module: {
		rules: [
			{
			  test: /\.css$/,
			  //exclude: /node_modules/,
			  use: [
				  {
					  loader: MiniCssExtractPlugin.loader
				  },
				  { 
					  loader: 'css-loader',
					  options: {
						  modules: {
                mode: resourcePath => {
								  return 'global';
							  },
                localIdentName: !isProduction ? '[name]--[local]--[hash:base64]' : '[hash:base64:5]'
						  },
						  esModule: false
					  }
          }
			  ]
		  },
			{
			  test: /\.(js|jsx)$/,
			  exclude: /node_modules/,
			  loader: 'babel-loader',
			  options: {
				  presets: ['@babel/preset-react']
			  }
		  },
      {
        test: /\.(png|svg|jpg|gif|webp)$/,
			  type: 'asset/resource',
			  generator: {
				  filename: '[path][name].[ext]'
			  }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
			  type: 'asset/resource',
			  generator: {
				  filename: '[path][name].[ext]'
			  }
      },
      {
        test: /\.json$/,
			  type: 'json',
			  generator: {
				  filename: '[path][name].[ext]'
			  }
      }
		]
	},

	plugins: [
	  new MiniCssExtractPlugin({
		  filename: 'styles/[name].css'
	  }),
	  new HtmlWebpackPlugin({
      publicPath: `${baseURL}/`,
		  filename: './index.html',
		  template: './index.html',
		  chunks: ['index', 'common'],
		  title: 'JSONDocs'
	  }),
	  new CleanWebpackPlugin(),
	  /*new CopyWebpackPlugin({
		  patterns: [
		    {from: 'assets', to: ''}
	    ]
	  }),*/
	  new webpack.LoaderOptionsPlugin({
		  options: {
			  debug: !isProduction,
			  minimize: true
		  }
	  }),
    new ESLintPlugin({
		  context: __dirname,
		  extensions: ['js', 'jsx'],
	    emitError: true,
	    failOnError: true,
	    quiet: true,
		  outputReport: false
    })
  ],

	optimization: {
	  /*splitChunks: {
		  chunks: 'all',
		  minChunks: 2,
		  minSize: 500,
		  filename: './scripts/common.js',
		  name: 'common'
	  },*/
	  minimize: isProduction,
	  minimizer: [new TerserPlugin({
		  terserOptions: {
			  'keep_fnames': true,
			  safari10: true
		  }
	  })]
  }
};

if (!isProduction) {
  options.devtool = 'inline-source-map'; // for style debug 'inline-source-map'
} else {
  options.plugins.push(new CleanWebpackPlugin());
}

module.exports = options;
