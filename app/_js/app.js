'use strict';

var ShapeShifter = require('./shape-shifter');
var ViewportAnimator = require('./viewport-animator');
var Nav = require('./nav');
var Smoothstate = require('./smoothstate');

document.addEventListener('DOMContentLoaded', function() {
	if (document.querySelector('.canvas')) {
		ShapeShifter.init();
	}

	Nav.init();
	ViewportAnimator.init();
	Smoothstate.init();
});