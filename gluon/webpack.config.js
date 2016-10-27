var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
	entry: { 
		main: './src/main.js',
		app: ['./src/app.ts']
	},
	target: 'electron',
	output: {
		path: __dirname + '/build',
		filename: '[name].js'
	},
	resolve: {
		extensions: ['', '.web.js', '.ts', '.tsx', '.js']
	},
	module: {
		loaders: [
			{ test: /\.tsx?$/, loader: 'ts-loader' }
		]
	},
	node: {
		__dirname: false,
		__filename: false
    },
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Gluon',
			filename: 'index.html',
			template: 'src/index-template.html'
		})
	]
};