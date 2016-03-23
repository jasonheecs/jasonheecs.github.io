'use strict';

var WOW = require('wow');
var SVGAnimator = require('./svg-animator');

/**
 * Set WOW.js offset for svg elements on posts page
 */
function setOffset(el) {
	el.setAttribute('data-wow-offset', el.clientHeight / 2);
}

function init() {
	//set wow trigger offsets for drawing svg elements on posts page
	if (document.querySelector('.drawing svg')) {
		Array.prototype.forEach.call(document.querySelectorAll('.drawing'), function(el) {
			setOffset(el);
		});
	}

	var wow = new WOW({
		boxClass: 'wow',
		animateClass: 'animated',
		callback: function(el) {
			if (el.classList.contains('drawing') && el.querySelector('svg')) {
				SVGAnimator.play(el.querySelector('svg').getAttribute('id'));
			}
		},
		mobile: true
	});

	wow.init();
}

module.exports = {
	init: init
};