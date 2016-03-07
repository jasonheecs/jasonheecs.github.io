var gulp = require('gulp');
var browsersync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var config = require('../../config').autoprefixer;

gulp.task('autoprefixer', function() {
	browsersync.notify('Compiling autoprefixer');

	return gulp.src(config.src)
		.pipe(autoprefixer(config.options))
		.pipe(gulp.dest(config.dest));
});