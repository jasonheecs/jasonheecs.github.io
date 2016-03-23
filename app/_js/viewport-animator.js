'use strict';

var WOW = require('wow');

function init() {
	var wow = new WOW({
		boxClass: 'animated--vp',
		animateClass: 'animated',
		offset: 0,
		mobile: true
	});

	wow.init();
}

module.exports = {
	init: init
};