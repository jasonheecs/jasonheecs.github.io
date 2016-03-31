'use strict';

var $ = require('jquery');
var Waypoint = require('waypoint');
var smoothState = require('./smoothState');

var $nav; //nav jQuery element
var offset; //offset to use for jquery scrollTo plugin
var scrollDuration = 800; //how long it takes to animate the scrollTo plugin
var navItemActiveCls = 'nav__link--active'; //active class for nav menu items
var waypoints = []; //list of Waypoints
var activeLinkEl; //current active link element
var isHomePage; //is current page the home page

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

/**
 * Scroll the window to a target DOM element.
 * @param {jQuery Object} $target [target to scroll to]
 */
function setScroll($target) {
	$(window).scrollTo($target, scrollDuration, {
		offset: {top: -offset , left: 0}
	});
}

/**
 * Removes the active class from the current active menu item.
 * @param  {DOMNode} navEl [Nav DOM element]
 */
function resetActiveLink(navEl) {
	var activeEl = activeLinkEl || navEl.querySelector('.' + navItemActiveCls);
	if (activeEl) {
		activeEl.classList.remove(navItemActiveCls);
	}
}

/**
 * Determines which menu item is to be set as the active item
 * @param  {DOMNode} navEl [the navigation menu DOM element]
 */
function determineActiveLink(navEl) {
	var homeLinkEl = document.getElementById('nav-home');
							
	if (isHomePage) {
		setActiveLink(homeLinkEl);
	}

	// set the active menu item based on scroll position
	var anchorLinks = navEl.querySelectorAll('a[href*="#"]');
	Array.prototype.forEach.call(anchorLinks, function(el) {
		var href = el.href;
		var correspondingEl = document.getElementById(href.substr(href.indexOf('#') + 1));

		if (correspondingEl) {
			waypoints.push(
				new Waypoint({
					element: correspondingEl,
					offset: offset + parseInt(window.getComputedStyle(correspondingEl).marginTop, 10) + 50 + 'px', //TODO: fix magic numbers
					handler: function(direction) {
						if (correspondingEl.id === 'works' && direction === 'up') {
							setActiveLink(homeLinkEl);
						} else {
							setActiveLink(el);
						}
					},
					group: 'nav'
				})
			);
		}
	});

	// Set the active menu item to be the last item when the window is scrolled to the bottom
	var lastLinkEl = anchorLinks[anchorLinks.length - 1];
	window.addEventListener('scroll', throttle(function(evt) {
		if (scrolledToBottom() && !document.getElementById('wrapper').classList.contains(smoothState.getExitingClass())) {
			setActiveLink(lastLinkEl);
		} else if (activeLinkEl === lastLinkEl && !scrolledToBottom()) {
			if (isHomePage) {
				setActiveLink(anchorLinks[anchorLinks.length - 2]);
			} else {
				resetActiveLink(navEl);
			}
		}
	}), 200);

	/**
	 * Check if the window has been scrolled to the bottom
	 * @return {boolean} true if window has been scrolled to the bottom
	 */
	function scrolledToBottom() {
		var scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
		var scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
		return (scrollTop + window.innerHeight) + offset >= scrollHeight;
	}

	/**
	 * Helper function to set the active link element
	 * @param {DOMNode} linkEl [element to be set as the active menu item]
	 */
	function setActiveLink(linkEl) {
		resetActiveLink(navEl);
		linkEl.classList.add(navItemActiveCls);
		activeLinkEl = linkEl;
	}
}

function init() {
	$nav = $('#main-nav');
	offset = $('#header').outerHeight();
	isHomePage = !!(document.getElementById('hero-content'));

	if (isHomePage) { //disable smoothstate on home link if @ home page (to prevent conflict between exit animation and scrollTo plugin)
		document.getElementById('nav-home').classList.add('no-smoothState');
	}

	//set the window to scroll to the relevant sections
	$nav.on('click', 'a', function(evt) {
		if (this.id === 'nav-works' && document.getElementById('works')) {
			evt.preventDefault();
			setScroll($('#works'));
		} else if (this.id === 'nav-contact') {
			evt.preventDefault();
			setScroll($('#footer'));
		} else if(this.id === 'nav-home' && isHomePage) {
			evt.preventDefault();
			setScroll($('#wrapper'));
		}
	});

	determineActiveLink($nav[0]);
}

/**
 * Resets the detection of the current active menu item
 * @param  {[boolean]} destroy [determines if the list of waypoints is to be destroyed]
 */
function reset(destroy) {
	resetActiveLink($nav[0]);
	waypoints.forEach(function(el) {
		el.destroy();
	});

	if (destroy) {
		waypoints = [];
	}
}

module.exports = {
	init: init,
	scrollTo: setScroll,
	reset: reset
};