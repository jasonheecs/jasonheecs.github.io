'use strict';

var ShapeShifter = require('./shape-shifter');
var SVGAnimator = require('./svg-animator');
var ViewportAnimator = require('./viewport-animator');

document.addEventListener('DOMContentLoaded', function() {
	if (document.querySelector('.canvas')) {
		ShapeShifter.init();
	}

	if (document.querySelector('.screens svg')) {
		SVGAnimator.init();
	}

	ViewportAnimator.init();
});