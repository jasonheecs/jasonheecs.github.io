'use strict';

var $ = require('jquery');
var smoothState = require('smoothstate');
var nav = require('./nav');
var shapeShifter = require('./shape-shifter');
var viewportAnimator = require('./viewport-animator');

var exitingClass = 'exiting';

function init(callback) {
  var options = {
    prefetch: true,
    cacheLength: 2,
    blacklist: '.no-smoothState, #footer a',
    scroll: true,
    onBefore: function($currentTarget) {
      nav.reset(true);
    },
    onStart: {
      duration: 250, // Duration of our animation
      render: function ($container) {
        // Add your CSS animation reversing class
        $container.addClass(exitingClass);

        // Restart your animation
        smoothState.restartCSSAnimations();
      }
    },
    onReady: {
      duration: 0,
      render: function ($container, $newContent) {
        // Remove your CSS animation reversing class
        $container.removeClass(exitingClass);

        // Inject the new content
        $container.html($newContent);
      }
    },
    onAfter: function($container, $newContent) {
      if (shapeShifter.hasInitialized()) {
        shapeShifter.reset();
      }
      viewportAnimator.destroy();
      
      callback.call();
    }
  };
  var smoothState = $('#wrapper').smoothState(options).data('smoothState');
}

module.exports = {
	init: init,
  getExitingClass: function() {
    return exitingClass;
  }
};