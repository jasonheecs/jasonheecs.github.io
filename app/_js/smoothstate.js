'use strict';

var $ = require('jquery');
var smoothState = require('smoothstate');
var nav = require('./nav');

// var scrollToWorks = false;

function init(callback) {
  var options = {
    prefetch: true,
    cacheLength: 2,
    blacklist: '.no-smoothState',
    scroll: true,
    onBefore: function($currentTarget) {
    	// if($currentTarget[0].id === 'nav-works') {
    	// 	scrollToWorks = true;
    	// }
    },
    onStart: {
      duration: 250, // Duration of our animation
      render: function ($container) {
        // Add your CSS animation reversing class
        $container.addClass('exiting');

        // Restart your animation
        smoothState.restartCSSAnimations();
      }
    },
    onReady: {
      duration: 0,
      render: function ($container, $newContent) {
        // Remove your CSS animation reversing class
        $container.removeClass('exiting');

        // Inject the new content
        $container.html($newContent);
      }
    },
    onAfter: function($container, $newContent) {
    	callback.call();

    	// console.log(window.location.hash);

    	// if (window.location.hash === '#works') {
    	// 	nav.scrollTo($('#works'));
    	// 	// scrollToWorks = false;
    	// }
    }
  };
  var smoothState = $('#wrapper').smoothState(options).data('smoothState');
}

module.exports = {
	init: init
};