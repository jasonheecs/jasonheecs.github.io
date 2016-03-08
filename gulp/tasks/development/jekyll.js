var gulp        = require('gulp');
var cp          = require('child_process');
var browsersync = require('browser-sync');
var config      = require('../../config').jekyll.development;

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll', function(done) {
  browsersync.notify('Compiling Jekyll');

  var bundleCmd = process.platform === "win32" ? "bundle.bat" : "bundle";

  return cp.spawn(bundleCmd, ['exec', 'jekyll', 'build', '-q', '--source=' + config.src, '--destination=' + config.dest, '--config=' + config.config], { stdio: 'inherit' })
  .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll'], function() {
  browsersync.reload();
});