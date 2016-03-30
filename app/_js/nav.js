'use strict';

var $ = require('jquery');
var Waypoint = require('waypoint');

var $nav;
var offset; //offset to use for jquery scrollTo plugin
var scrollDuration = 800;
var navItemActiveCls = 'nav__item--active';
var waypoints = [];

/**
 * Used for throttling function calls
 * @param  {Function} fn        [function to throttle]
 * @param  {int}   	  threshold [throttle interval in ms]
 * @param  {Object}   scope     
 */
function throttle(fn, threshold, scope) {
	threshold = threshold || (threshold = 250);
	var last;
	var deferTimer;

	return function() {
		var context = scope || this;

		var now = +new Date; //shorthand for Number(new Date)
		var args = arguments;

		if (last && now < last + threshold) {
			clearTimeout(deferTimer);
			deferTimer = setTimeout(function() {
				last = now;
				fn.apply(context, args);
			}, threshold);
		} else {
			last = now;
			fn.apply(context, args);
		}
	};
}

function setScroll(targetEl) {
	$(window).scrollTo(targetEl, scrollDuration, {
		offset: {top: -offset , left: 0}
	});
}

function resetActiveLink(navEl) {
	var activeEl = navEl.querySelector('.' + navItemActiveCls);
	if (activeEl) {
		activeEl.classList.remove(navItemActiveCls);
	}
}

function setActiveLink(navEl) {
	var anchorLinks = navEl.querySelectorAll('a[href*="#"]');
	Array.prototype.forEach.call(anchorLinks, function(el) {
		var href = el.href;
		var correspondingEl = document.getElementById(href.substr(href.indexOf('#') + 1));

		if (correspondingEl) {
			waypoints.push(
				new Waypoint({
					element: correspondingEl,
					offset: offset + parseInt(window.getComputedStyle(correspondingEl).marginTop, 10) + 'px',
					handler: function(direction) {
						resetActiveLink(navEl);

						if (correspondingEl.id === 'works' && direction === 'up') {
							var homeLinkEl = document.getElementById('nav-home');
							homeLinkEl.classList.add(navItemActiveCls);
						} else {
							el.classList.add(navItemActiveCls);
						}
					},
					group: 'nav'
				})
			);
		}
	});

	window.addEventListener('scroll', throttle(function(evt) {
		if (scrolledToBottom()) {
			resetActiveLink(navEl);
			anchorLinks[anchorLinks.length - 1].classList.add(navItemActiveCls);
		}
	}), 200);

	function scrolledToBottom() {
		var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
		var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
		return (scrollTop + window.innerHeight) + offset >= scrollHeight;
	}
}

function init() {
	$nav = $('#main-nav');
	offset = $('#header').outerHeight();

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

	// if (waypoints.length) {
	// 	waypoints.forEach(function(el) {
	// 		el.enable();
	// 	});
	// } else {
	// 	setActiveLink($nav[0]);
	// }
}

function reset() {
	waypoints.forEach(function(el) {
		el.disable();
	});
}

module.exports = {
	init: init,
	scrollTo: setScroll,
	reset: reset
};