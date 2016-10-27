'use strict';

var gulp = require('gulp');
var ts = require('gulp-typescript');
var exec = require('gulp-exec');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var childProcess = require('child_process');
var electron = require('electron');

gulp.task('build', function () {
	return gulp.src('src/main.js')
		.pipe(webpack( require('./webpack.config.js')))
		.pipe(gulp.dest('build'));
});

gulp.task('launch', ['build'], function() {
	gulp.src('build/main.js')
		.pipe(exec('electron build/main.js'));
});

