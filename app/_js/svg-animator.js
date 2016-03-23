/* globals Vivus */

'use strict';

require('vivus');

function playSVG(svgId) {
	if (document.getElementById(svgId)) {
		var vivus = new Vivus(svgId, {
			duration: 100,
			type: 'async',
			start: 'manual'
		}, function(vivus) {
			var img = vivus.el.parentNode.querySelector('.drawing__img');
			img.classList.remove('drawing__img--hidden');
		});

		vivus.play();
	}
}

module.exports = {
	play: playSVG
};