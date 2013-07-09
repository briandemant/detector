"use strict";
var _ = require('lodash');

var list = [];

function make(family, osRegEx, fn) {
	list.push({ detect: function (ua) {
		var match = new RegExp(osRegEx).exec(ua.useragent);
		if (match) {

			if (fn) {
				return fn(family, match, ua);
			}
			var version = match[1];
			return {
				version : version,
				family  : family,
				fullname: family + " " + version,
				is      : {device: true}
			}
		}
	}
	          });
}


make("Nintendo", /Nintendo (\w+)/);
make("Silk", /Linux.*Silk\/([0-9.]+)/, function (family, match, ua) {
	var version = match[1];
	family = "Kindle Fire";
	return {
		version : version,
		family  : family,
		fullname: family + " " + version,
		is      : {tablet: true, device: true, desktop: false}
	}
});

module.exports = list;