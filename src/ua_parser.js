//This is the part that tries to guess info about the user given an user agent string
"use strict";
// uses promises via the [rsvp](https://github.com/tildeio/rsvp.js) framework
var RSVP = require('rsvp');
var UserAgent = require("../src/user_agent.js");


function UAParser(options) {
	this.options = options;
}


UAParser.prototype.parse = function (agent) {
	var promise = new RSVP.Promise(); 
	if (!agent || agent.trim() === "") {
		promise.reject("User agent must be supplied");
	}
	
	promise.resolve(new UserAgent());
	
	return promise;
};

module.exports = UAParser;