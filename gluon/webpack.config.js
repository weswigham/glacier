var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: { 
		main: './src/main.js',
		app: ['./src/app.ts']
	},
	target: 'electron',
	output: {
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
	plugins: [
		new HtmlWebpackPlugin({
			 
		})
	]
};