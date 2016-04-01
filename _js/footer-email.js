/**
 * Insert mailto link in footer email link to prevent spam bots from harvesting.
 */
'use strict';

var linkEl;

/**
 * Get the actual email address from the footer link element without the nospam span tags
 * @return {[string]}
 */
function getEmail() {
	var nodes = linkEl.childNodes;
	var email = '';

	Array.prototype.forEach.call(nodes, function(node) {
		if (node.nodeType === 3) {
			email += node.nodeValue;
		}
	});

	return email;
}

function init() {
	linkEl = document.getElementById('contact-email');
	linkEl.href = "mailto:" + getEmail();
}


module.exports = {
	init: init
};