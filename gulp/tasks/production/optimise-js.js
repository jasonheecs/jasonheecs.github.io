/**
 * Minify JS files
 * Dependencies:
 * 	- gulp-uglify
 * 	- gulp-size
 * 	- gulp-strip-debug
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var size = require('gulp-size');
var config = require('../../config').optimise.js;

gulp.task('optimise:js', function() {
	return gulp.src(config.src)
		.pipe(stripDebug())
		.pipe(uglify())
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'Optimised JS Files', showFiles:true}));
});