//Detector
//--------
//		
//This is the part that tries to guess info about the user given an user agent string
"use strict";


// EventBinder
// -----------

// The event binder facilitates the binding and unbinding of events
// from objects that extend `Backbone.Events`. It makes
// unbinding events, even with anonymous callback functions,
// easy. 
//
// Inspired by [Johnny Oshika](http://stackoverflow.com/questions/7567404/backbone-js-repopulate-or-recreate-the-view/7607853#7607853)

function parse(agent) {
	if (!agent || agent.trim() === "") {
		throw "no input";
	}
}


module.exports = exports = {
	parse: parse
};