'use strict';

var ShapeShifter = require('./shape-shifter');
var ViewportAnimator = require('./viewport-animator');
var Nav = require('./nav');
var Smoothstate = require('./smoothstate');

function init() {
	if (document.querySelector('.canvas')) {
		ShapeShifter.init();
	}

	Nav.init();
	ViewportAnimator.init();
}

document.addEventListener('DOMContentLoaded', function() {
	init();
	Smoothstate.init(init);
});