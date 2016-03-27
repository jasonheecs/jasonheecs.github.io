'use strict';

var $ = require('jquery');
var $nav;
var offset; //offset to use for jquery scrollTo plugin

function setScroll(targetEl) {
	$(window).scrollTo(targetEl, 800, {
		offset: {top: offset , left: 0}
	});
}

function init() {
	$nav = $('#main-nav');
	offset = -$('#header').outerHeight();

	$nav.on('click', 'a', function(evt) {
		if (this.id === 'nav-works') {
			evt.preventDefault();
			setScroll($('#works'));
		} else if (this.id === 'nav-contact') {
			evt.preventDefault();
			setScroll($('#footer'));
		}
	});
}

module.exports = {
	init: init
};