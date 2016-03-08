/**
 * Minimize image file sizes for production build
 * Dependencies:
 * 	- gulp-imagemin
 * 	- gulp-size
 * 	- imagemin-pngquant
 * 	- imagemin-jpeg-recompress
 */

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var config = require('../../config').optimise.images;

gulp.task('optimise:images', function() {
	//configure plugins for imagemin
	var pluginsConfig = config.plugins;
	var pngPlugin = require(pluginsConfig.png.name);
	var jpgPlugin = require(pluginsConfig.jpg.name);
	config.options.use = [pngPlugin(pluginsConfig.png.options),jpgPlugin(pluginsConfig.jpg.options)];

	return gulp.src(config.src)
		.pipe(imagemin(config.options))
		.pipe(gulp.dest(config.dest))
		.pipe(size({title: 'Optimised Image Files', showFiles:false}));
});