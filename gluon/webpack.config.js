var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
	entry: { 
		main: APP_DIR + '/main.js',
		app: [ APP_DIR + '/app.ts']
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
			excludeChunks: ['main'],
			filename: 'index.html',
			template: APP_DIR + '/index-template.html'
		})
	]
};