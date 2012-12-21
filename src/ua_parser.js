//This is the part that tries to guess info about the user given an user agent string
"use strict"; 

var _ = require('lodash');
var UserAgent = require("../src/user_agent.js");
var browsers = require("../src/resources/browsers.js");
var os = require("../src/resources/os.js");
var spiders = require("../src/resources/spiders.js");
var devices = require("../src/resources/devices.js");


function UAParser(options) {
	this.options = options;
}


UAParser.prototype.parse = function (agent) {
	if (!agent || agent.length < 5) {
		return { err: "User agent must be supplied" };
	}

	var ua = new UserAgent(agent);
	if (ua.err) {
		return ua;
	}

	// some stop on first true
	spiders.some(function (matcher) {
		var result = matcher.detect(ua);
		if (result) {
			ua.device = ua.device || {};
			ua.device.fullname = result.fullname;
			ua.device.family = result.family;
			ua.device.version = result.version;
			ua.is = _.assign(ua.is, result.is);
			return true;
		}
	});
	devices.some(function (matcher) {
		var result = matcher.detect(ua);
		if (result) {
			ua.device = ua.device || {};
			ua.device.fullname = result.fullname;
			ua.device.family = result.family;
			ua.device.version = result.version;
			ua.is = _.assign(ua.is, result.is);
			return true;
		}
	});

	if (!ua.is.spider) {
		// some stop on first true
		os.some(function (matcher) {
			var result = matcher.detect(ua);
			if (result) {
				ua.os.name = result.name;
				ua.os.family = result.family;
				ua.os.fullname = result.fullname;
				//ua.os.version = result.version;
				ua.is = _.assign(ua.is, result.is);
				return true;
			}
		});
		// some stop on first true
		browsers.some(function (matcher) {
			var result = matcher.detect(ua);
			if (result) {
				ua.browser.name = result.name;
				ua.browser.fullname = result.fullname;
				ua.browser.family = result.family;
				ua.browser.version = result.version;
				ua.is = _.assign(ua.is, result.is);
				return true;
			}
		});
	}

	ua.is.unknown = !(ua.is.tablet || ua.is.mobile || ua.is.desktop);

	return ua;
};

module.exports = UAParser;