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

var ShapeBuilder = (function() {
	var gap = 13;
	var shapeCanvas = document.createElement('canvas');
	var shapeContext = shapeCanvas.getContext('2d');
	var fontSize = 500;
	var fontFamily = 'Helvetica Neue, Helvetica, Arial, sans-serif';

	function fit() {
		shapeCanvas.width = Math.floor(window.innerWidth / gap) * gap;
		shapeCanvas.height = Math.floor(window.innerHeight / gap) * gap;
		shapeCanvas.fillStyle = 'red';
		shapeCanvas.textBaseline = 'middle';
		shapeCanvas.textAlign = 'center';
	}

	function processCanvas() {
		var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data;
		var dots = [];
		var x = 0;
		var y = 0;
		var fx = shapeCanvas.width;
		var fy = shapeCanvas.height;
		var w = 0;
		var h = 0;

		for (var p = 0; p < pixels.length; p += (4 * gap)) {
			if (pixels[p + 3] > 0) {
				dots.push(new Point({
					x: x,
					y: y
				}));

				w = x > w ? x : w;
				h = y > h ? y : h;
				fx = x < fx ? x :fx;
				fy = y < fy ? y : fy;
			}

			x += gap;

			if (x >= shapeCanvas.width) {
				x = 0;
				y += gap;
				p += gap * 4 * shapeCanvas.width;
			}
		}

		return {dots: dots, w: w + fx, h: h + fy};
	}

	function setFontSize(s) {
		shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
	}

	function isNumber(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}

	return {
		init: function() {
			fit();
			//TODO: throttle
			window.addEventListener('resize', fit);
		},

		letter: function(l) {
			console.log(l);
			var s = 0;

			setFontSize(fontSize);
			s = Math.min(fontSize,
						(shapeCanvas.width / shapeContext.measureText(l).width) * 0.8 * fontSize,
						(shapeCanvas.height / fontSize) * (isNumber(l) ? 1 : 0.45) * fontSize);
			setFontSize(s);

			shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
			shapeContext.fillText(l, shapeCanvas.width / 2, shapeCanvas.height / 2);

			return processCanvas();
		}
	};
})();

var Shape = (function() {
	var dots = [];
	var width = 0;
	var height = 0;
	var cx = 0;
	var cy = 0;

	function compensate() {
		var area = Drawing.getArea();

		cx = area.width / 2 - width / 2;
		cy = area.height / 2 - height / 2;
	}

	return {
		shuffleIde: function() {
			var area = Drawing.getArea();

			dots.forEach(function(dot) {
				if (!dot.s) {
					dot.move({
						x: Math.random() * area.width,
						y: Math.random() * area.height
					});
				}
			});
		},

		switchShape: function(shapeBuilder, fast) {
			var size;
			var area = Drawing.getArea();
			var d = 0;
			var i = 0;

			width = shapeBuilder.w;
			height = shapeBuilder.h;

			compensate();

			if (shapeBuilder.dots.length > dots.length) {
				size = shapeBuilder.dots.length - dots.length;
				for (d = 1; d <= size; d++) {
					dots.push(new Dot(area.width / 2, area.height / 2));
				}
			}

			d = 0;

			while(shapeBuilder.dots.length > 0) {
				i = Math.floor(Math.random() * shapeBuilder.dots.length);
				dots[d].e = fast ? 0.25 : (dots[d].s ? 0.14: 0.11);

				if (dots[d].s) {
					dots[d].move(new Point({
						z: Math.random() * 20 + 10,
						a: Math.random(),
						h: 18
					}));
				} else {
					dots[d].move(new Point({
						z: Math.random() * 5 + 5,
						h: fast ? 18 : 30
					}));
				}

				dots[d].s = true;
				dots[d].move(new Point({
					x: shapeBuilder.dots[i].x + cx,
					y: shapeBuilder.dots[i].y + cy,
					a: 1,
					z: 5,
					h: 0
				}));

				//remove moved dot from ShapeBuilder dots array
				shapeBuilder.dots = shapeBuilder.dots.slice(0, i).concat(shapeBuilder.dots.slice(i + 1));
				d++;
			}

			for (i = d; i < dots.length; i++) {
				if (dots[i].s) {
					dots[i].move(new Point({
						z: Math.random() * 20 + 10,
						a: Math.random(),
						h: 20
					}));

					dots[i].s = false;
					dots[i].e = 0.04;
					dots[i].move(new Point({
						x: Math.random() * area.width,
						y: Math.random() * area.height,
						a: 0.3,
						z: Math.random() * 4,
						h: 0
					}));
				}
			}
		},

		render: function() {
			// console.log(dots);
			dots.forEach(function(dot) {
				dot.render();
			});
		}
	};
})();

var Sequencer = (function() {
	var sequence = [];
	var interval;
	var currentAction;
	var cmd = '#';
	var resizeTimer;

	function getAction(value) {
		value = value && value.split(' ')[0];
		return value && value[0] === cmd && value.substring(1);
	}

	function getValue(value) {
		return value && value.split(' ')[1];
	}

	function timedAction(fn, delay, max, reverse) {
		clearInterval(interval);
		currentAction = reverse ? max : 1;
		fn(currentAction);

		if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
			interval = setInterval(function() {
				currentAction = reverse ? currentAction - 1 : currentAction + 1;
				fn(currentAction);

				if ((!reverse && max && currentAction === max) || (reverse && currentAction === 0)) {
					clearInterval(interval);
				}
			}, delay);
		}
	}

	function performAction(value) {
		var action;
		var current;
		sequence = typeof(value) === 'object' ? value : sequence.concat(value.split('|'));

		timedAction(function() {
			current = sequence.shift();
			action = getAction(current);
			value = getValue(current);

			switch (action) {
				default:
					Shape.switchShape(ShapeBuilder.letter(current[0] === cmd ? 'Error' : current));
			}
		}, 2000, sequence.length);
	}

	function reset(destroy) {
		clearInterval(interval);
		sequence = [];

		if (destroy) {
			Shape.switchShape(ShapeBuilder.letter(''));
		}
	}

	function bindEvents() {
		window.addEventListener('resize', function () {
	      clearTimeout(resizeTimer);
	      resizeTimer = setTimeout(function () {
	        Shape.shuffleIdle();
	        reset(true);
	      }, 500);
	    });
	}

	return {
		init: function() {
			bindEvents();
		},
		performAction: performAction
	};
})();

module.exports = {
	init: function() {
		Drawing.init('.canvas-new');
		ShapeBuilder.init();

		Sequencer.performAction('Shape|Shifter|Type|to start|#icon thumbs-up|#countdown 3||');

		Drawing.loop(function() {
			Shape.render();
		});
	}
};
