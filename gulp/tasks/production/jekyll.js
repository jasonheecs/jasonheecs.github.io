var gulp        = require('gulp');
var cp          = require('child_process');
var browsersync = require('browser-sync');
var config      = require('../../config').jekyll.production;

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll:production', function(done) {
  browsersync.notify('Compiling Jekyll (Production)');

  var bundleCmd = process.platform === "win32" ? "bundle.bat" : "bundle";

  return cp.spawn(bundleCmd, ['exec', 'jekyll', 'build', '-q', '--source=' + config.src, '--destination=' + config.dest, '--config=' + config.config], { stdio: 'inherit' })
  .on('close', done);
});