'use strict';

var Waypoint = require('waypoint');
var SVGAnimator = require('./svg-animator');

var animationInitCls = 'animation--hidden';
var waypoints = [];

/**
 * Set animation offset for svg elements on posts page
 */
function setOffset(el) {
	el.setAttribute('data-vp-offset', el.clientHeight / 2);
}

/**
 * Detects and sets the right css property for animation delay
 * @param {DOMNode} el
 * @param {String} delay [the value to set to css property animation-delay]
 */
function setAnimationDelay(el, delay) {
	var style = window.getComputedStyle(el);
	var prop;

	if (style.getPropertyValue('animation-delay')) {
		prop = 'animation-delay';
	} else if (style.getPropertyValue('-webkit-animation-delay')) {
		prop = '-webkit-animation-delay';
	} else if (style.getPropertyValue('-moz-animation-delay')) {
		prop = '-moz-animation-delay';
	}

	el.style.setProperty(prop, delay);
}

/**
 * Detects and sets the right css property for animation duration
 * @param {DOMNode} el
 * @param {String} duration [the value to set to css property animation-duration]
 */
function setAnimationDuration(el, duration) {
	var style = window.getComputedStyle(el);
	var prop;

	if (style.getPropertyValue('animation-duration')) {
		prop = 'animation-duration';
	} else if (style.getPropertyValue('-webkit-animation-duration')) {
		prop = '-webkit-animation-duration';
	} else if (style.getPropertyValue('-moz-animation-duration')) {
		prop = '-moz-animation-duration';
	}

	el.style.setProperty(prop, duration);
}

function drawSVG(el) {
	SVGAnimator.play(el.querySelector('svg').getAttribute('id'));
}

function init() {
	//set animation trigger offsets for drawing svg elements on posts page
	if (document.querySelector('.drawing svg')) {
		Array.prototype.forEach.call(document.querySelectorAll('.drawing'), function(el) {
			setOffset(el);
		});
	}

	Array.prototype.forEach.call(document.querySelectorAll('[data-vp-animation]'), function(el){
		el.style.visibility='hidden';
		var elClassList = el.classList;
		elClassList.add(animationInitCls);

		waypoints.push(
			new Waypoint({
				element: el,
				offset: el.getAttribute('data-vp-offset') ? el.getAttribute('data-vp-offset') : '90%',
				handler: function() {
					if (el.getAttribute('data-vp-delay')) {
						setAnimationDelay(el, el.getAttribute('data-vp-delay'));
					}

					if (el.getAttribute('data-vp-duration')) {
						setAnimationDuration(el, el.getAttribute('data-vp-duration'));
					}

					el.style.visibility='visible';
					elClassList.remove(animationInitCls);
					elClassList.add('animated');
					elClassList.add(el.getAttribute('data-vp-animation'));

					if (el.classList.contains('drawing') && el.querySelector('svg')) {
						drawSVG(el);
					}

					this.destroy();
				}
			})
		);
	});	
}

/**
 * Free up all memory used by the waypoints instances of ViewportAnimator
 * Not too sure if there is a more elegant solution to this, the destroy method
 * of the Waypoints object does not seem to actually remove the waypoint from memory
 * (According to Firefox's profiler anyway)
 */
function destroy() {
	waypoints = [];
	console.log(waypoints);
}

module.exports = {
	init: init,
	destroy: destroy
};