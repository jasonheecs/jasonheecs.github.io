var gulp = require('gulp');
var runSequence = require('run-sequence');
var es = require("event-stream");
var config = require('../../config').github;

gulp.task('github', function(callback) {
  runSequence('delete', 'jekyll:production',
  [
    'sass',
    'scripts',
    'images'
  ],
  'base64',
  [
    'optimise:css',
    'optimise:js',
    'optimise:images'
  ],
  'github:move-files',
  'delete',
  callback);
});

gulp.task('github:move-files', function() {
	var files = config.files;

	var tasks = files.map(function(file) {
		return gulp.src(file.src, file.options)
			.pipe(gulp.dest(file.dest));	
	});

	return es.merge(tasks);
});