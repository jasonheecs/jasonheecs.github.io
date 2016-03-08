/**
 * Gulp Task to generate CSS from SCSS
 * Dependencies:
 *   - browser-sync
 *   - gulp-sass
 *   - gulp-sourcemaps
 *   - gulp-autoprefixer
 */

var gulp = require('gulp');
var browsersync = require('browser-sync');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../../config');

gulp.task('sass', function() {
	var sassConfig = config.sass;
	sassConfig.onError = browsersync.notify;

	browsersync.notify('Compiling Sass');

	return gulp.src(sassConfig.src)
		.pipe(sourcemaps.init())
		.pipe(sass(sassConfig.options).on('error', sass.logError))
		.pipe(autoprefixer(config.autoprefixer))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(sassConfig.dest));
});