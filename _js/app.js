'use strict';

var ShapeShifter = require('./shape-shifter');
var ViewportAnimator = require('./viewport-animator');
var Nav = require('./nav');
var Smoothstate = require('./smoothstate');
var FooterEmail = require('./footer-email');

function init() {
	if (document.querySelector('.canvas')) {
		ShapeShifter.init();
	}

	Nav.init();
	ViewportAnimator.init();
	FooterEmail.init();
}

document.addEventListener('DOMContentLoaded', function() {
	init();
	Smoothstate.init(init);
});