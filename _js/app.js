'use strict';

/* globals Modernizr */

require('modernizr');
var ShapeShifter = require('./shape-shifter');
var ViewportAnimator = require('./viewport-animator');
var Nav = require('./nav');
var Smoothstate = require('./smoothstate');
var FooterEmail = require('./footer-email');

function init() {
	if ((window.innerWidth >= 960 && !Modernizr.touchevents) && document.querySelector('.canvas')) {
		ShapeShifter.init();
	}

	Nav.init();
	ViewportAnimator.init();
	FooterEmail.init();
    if (window.ga) {
        window.ga('send', 'pageview');
    }
}

document.addEventListener('DOMContentLoaded', function() {
	init();
	Smoothstate.init(init);
});