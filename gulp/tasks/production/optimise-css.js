/**
 * 	Minify css via cssnano
 * 	Dependencies:
 * 		- gulp-cssnano
 * 		- gulp-size
 */

var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var config = require('../../config').optimise.css;
var size = require('gulp-size');

gulp.task('optimise:css', function() {
	return gulp.src(config.src)
		.pipe(cssnano(config.options))
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'Optimised CSS Files', showFiles:true}));
});