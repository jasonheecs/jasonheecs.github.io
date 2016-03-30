'use strict';

var $ = require('jquery');
var Waypoint = require('waypoint');

var $nav;
var offset; //offset to use for jquery scrollTo plugin
var scrollDuration = 800;
var navItemActiveCls = 'nav__item--active';

function setScroll(targetEl) {
	$(window).scrollTo(targetEl, scrollDuration, {
		offset: {top: offset , left: 0}
	});
}

function resetActiveLink(navEl) {
	var activeEl = navEl.querySelector('.' + navItemActiveCls);
	activeEl.classList.remove(navItemActiveCls);
}

function setActiveLink(navEl) {
	var anchorLinks = navEl.querySelectorAll('a[href*="#"]');
	Array.prototype.forEach.call(anchorLinks, function(el) {
		var href = el.href;
		var correspondingEl = document.getElementById(href.substr(href.indexOf('#') + 1));
		console.log(correspondingEl);
		if (correspondingEl) {
			new Waypoint({
				element: correspondingEl,
				handler: function() {
					resetActiveLink(navEl);
					el.classList.add(navItemActiveCls);
				}
			});
		}
	});
}

function init() {
	$nav = $('#main-nav');
	offset = -$('#header').outerHeight();

	//set the window to scroll to the relevant sections
	$nav.on('click', 'a', function(evt) {
		if (this.id === 'nav-works' && document.getElementById('works')) {
			evt.preventDefault();
			setScroll($('#works'));
		} else if (this.id === 'nav-contact') {
			evt.preventDefault();
			setScroll($('#footer'));
		}
	});

	setActiveLink($nav[0]);

	// new Waypoint({
	// 	element: document.getElementById('works'),
	// 	handler: function() {

	// 	}
	// });
}

module.exports = {
	init: init,
	scrollTo: setScroll
};