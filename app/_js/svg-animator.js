/* globals Vivus */

'use strict';

require('vivus');

var svgIds = ['desktop', 'tablet', 'mobile'];

function init() {
	svgIds.forEach(function(id) {
		if (document.getElementById(id)) {
			new Vivus(id, {
				duration: 100,
				type: 'async'
			}, function() {
				console.log('svg anim callback');
			});
		}
	});
}

module.exports = {
	init: init
};