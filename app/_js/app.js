'use strict';

var ShapeShifter = require('./shape-shifter');
var ViewportAnimator = require('./viewport-animator');
var Nav = require('./nav');

document.addEventListener('DOMContentLoaded', function() {
	if (document.querySelector('.canvas')) {
		ShapeShifter.init();
	}

	Nav.init();
	ViewportAnimator.init();
});