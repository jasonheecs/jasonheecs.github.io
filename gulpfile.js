/**
 * 	Requires all tasks in gulp/tasks, including subfolders
 * 	Dependencies: 
 * 	 - require-dir
 */

var requireDir = require('require-dir');

requireDir('./gulp/tasks', {recurse:true});