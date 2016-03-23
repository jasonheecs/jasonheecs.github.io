'use strict';

var ShapeShifter = require('./shape-shifter');
var ViewportAnimator = require('./viewport-animator');

document.addEventListener('DOMContentLoaded', function() {
	if (document.querySelector('.canvas')) {
		ShapeShifter.init();
	}

	ViewportAnimator.init();
});