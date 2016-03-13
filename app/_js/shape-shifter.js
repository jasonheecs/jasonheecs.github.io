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

var Dot = function(x, y) {
	this.Point = new Point({
		x: x,
		y: y,
		z: 5,
		a: 1,
		h: 0
	});

	//TODO
	this.e = 0.07;
	this.s = true;

	this.Color = new Color(31, 31, 31, this.Point.a);

	this.t = this.clone();
	this.q = [];
};

Dot.prototype = {
	clone: function() {
		return new Point({
			x: this.x,
			y: this.y,
			z: this.z,
			a: this.a,
			h: this.h
		});
	},

	_draw: function() {
		this.Color.a = this.Point.a;
		Drawing.drawCircle(this.Point, this.Color);
	},

	_moveTowards: function(Point2) {
		var details = this.distanceTo(Point2, true);
		var deltaX = details[0];
		var deltaY = details[1];
		var distance = details[2];
		var e = this.e * distance;

		if (this.Point.h === -1) {
			this.Point.x = Point2.x;
			this.Point.y = Point2.y;
			return true;
		}

		if (distance > 1) {
			this.Point.x -= ((deltaX / distance) * e);
			this.Point.y -= ((deltaY / distance) * e);
		} else {
			if (this.Point.h > 0) {
				this.Point.h--;
			} else {
				return true;
			}
		}

		return false;
	},

	distanceTo: function(n, details) { //calculate the distance between 2 Points using Pythagorean theorem
		var dx = this.Point.x - n.x;
		var dy = this.Point.y - n.y;
		var d = Math.sqrt(dx * dx + dy * dy);

		return details ? [dx, dy, d] : d;
	},

	_update: function() {
		var pt;
		var delta;

		if (this._moveTowards(this.t)) {
			pt = this.q.shift();

			if (pt) {
				this.t.x = pt.x || this.Point.x;
				this.t.y = pt.y || this.Point.y;
				this.t.z = pt.z || this.Point.z;
				this.t.a = pt.a || this.Point.a;
				this.Point.h = pt.h || 0;
			} else {
				if (this.s) {
					this.Point.x -= Math.sin(Math.random() * Math.PI);
					this.Point.y -= Math.sin(Math.random() * Math.PI);
				} else {
					this.move(new Point({
						x: this.Point.x + (Math.random() * 50) - 25,
						y: this.Point.y + (Math.random() * 50) - 25	
					}));
				}
			}
		}

		//alpha
		delta = this.Point.a - this.t.a;
		this.Point.a = Math.max(0.1, this.Point.a - (delta * 0.05));
		//z
		delta = this.Point.z - this.t.z;
		this.Point.z = Math.max(1, this.Point.z - (delta * 0.05));
	},

	move: function(pt, avoidStatic) {
		if (!avoidStatic || (avoidStatic && this.distanceTo(pt) > 1)) {
			this.q.push(pt);
		}
	},

	render: function() {
		this._update();
		this._draw();
	}
};


module.exports = {
	init: function() {
		Drawing.init('.canvas');
	}
};
