/**
 * Based on http://www.kennethcachia.com/shape-shifter
 */
'use strict';

var Drawing = (function() {
	var canvas;
	var context;
	var renderFn;
	var requestFrame = window.requestAnimationFrame ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
						window.oRequestAnimationFrame ||
						window.msRequestAnimationFrame ||
						function(callback) {
							window.setTimeout(callback, 1000 / 60);
						};
	return {
		init: function (el) {
			canvas = document.querySelector(el);
			context = canvas.getContext('2d');
			this.adjustCanvas();

			//TODO: add throttle
			window.addEventListener('resize', function() {
				Drawing.adjustCanvas();
			});
		},

		loop: function(fn) {
			renderFn = !renderFn ? fn : renderFn;
			this.clearFrame();
			renderFn();
			requestFrame.call(window, this.loop.bind(this));
		},

		adjustCanvas: function() {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		},

		clearFrame: function() {
			context.clearRect(0, 0, canvas.width, canvas.height);
		},

		getArea: function() {
			return {
				w: canvas.width,
				h: canvas.height
			};
		},

		drawCircle: function(point, color) {
			context.fillStyle = color.render();
			context.beginPath();
			context.arc(point.x, point.y, point.z, 0, 2 * Math.PI, true);
			context.closePath();
			context.fill();
		}
	};
})();

var Point = function(args) {
	this.x = args.x;
	this.y = args.y;
	this.z = args.z;
	this.a = args.a;
	this.h = args.h;
};

var Color = function (r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
};
Color.prototype.render = function() {
	return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
};

module.exports = {
	init: function() {
		Drawing.init('.canvas');
	}
};
