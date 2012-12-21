"use strict";
var _ = require('lodash');

var list = [];
var browser = {};
function make(family, osRegEx, fn) {
	list.push({ detect: function (ua) {
		var match = new RegExp(osRegEx).exec(ua.uaOriginal);
		if (match) {
			if (fn) {
				return fn(family, match, ua);
			}
			return {
				family  : family,
				name    : family,
				fullname: family + " " + match[1],
				is      : browser
			}
		}
	}
	          });
}


function isChrome(family, match, ua) {
	var name = family;
	if (ua.is.mobile || ua.is.tablet) {
		name = "Chrome Mobile";
	} else if (ua.uaOriginal.indexOf('CriOS') !== -1) {
		ua.is.mobile = true;
		ua.is.desktop = false;
	}
	return {
		name    : name,
		fullname: name + " " + match[1],
		version : match[1],
		family  : family,
		is      : browser
	}
}
function isIE(family, match, ua) {
	var name = family;
	if (ua.is.mobile || ua.is.tablet) {
		name = "IE Mobile";
	}
	return {
		name    : name,
		fullname: name + " " + match[1],
		version : match[1],
		family  : family,
		is      : browser
	}
}

function isSomething(family, match, ua) {
	var name = family;
	var version = match[1];
	return {
		name    : name,
		fullname: name + (version ? " " + version : ''),
		version : version,
		family  : family,
		is      : browser
	}
}
function isSilk(family, match, ua) {
	var name = "Silk";
	  family = "Safari";
	var version = match[1];
	return {
		name    : name,
		fullname: name + (version ? " " + version : ''),
		version : version,
		family  : family,
		is      : browser
	}
}

var webkitVersion = new RegExp('Version/(\\d+)');
var notSafari = new RegExp('RIM Tablet OS|Android|Silk');
function isSafari(family, match, ua) {
	var name = family;
	var version = "";
	var fullname = name;

	if (notSafari.exec(ua.uaOriginal)) {
		return;
	}

	if (ua.is.mobile || ua.is.tablet) {
		name = "Mobile Safari";
	}
	var webkitV = webkitVersion.exec(ua.uaOriginal);
	if (webkitV) {
		version = webkitV[1];
		fullname = name + " " + version;
	} else if (ua.os.version) {
		version = ua.os.version;
		fullname = name + " " + ua.os.version;
	}
	return {
		name    : name,
		fullname: fullname,
		version : version,
		family  : family,
		is      : browser
	}
}


function isAndroid(family, match, ua) {
	var name = family;
	var version = "";
	var fullname = name;

	var match = webkitVersion.exec(ua.uaOriginal);
	if (match) {
		version = match[1]
		fullname = name + " " + version;
	} else if (ua.os.version) {
		version = ua.os.version;
		fullname = name + " " + ua.os.version;
	}
	return {
		name    : name,
		fullname: fullname,
		version : version,
		family  : family,
		is      : browser
	}
}

make("Avant Browser", /Avant Browser/, isSomething);
make("IE", /msie\s*([\d\.]+[\d])/i, isIE);
make("Chrome", /(?:chrome|CriOS)\/((\d+)(\.\d+)?)/i, isChrome);
make("Safari", /Safari|iPhone|iPad|iPod/, isSafari);
make("Blackberry Browser", /RIM Tablet OS.*Version\/(\d+\.\d+)/, isSomething);
make("Firefox", /firefox\/((\d+)(\.\d+)?)/i, isSomething);
make("Opera", /(?:opera.*version\/|opera[\/ ])(\d+\.\d+)/i, isSomething);
make("Android Webkit", /Android/, isAndroid);
make("Mozilla", /Mozilla.*rv:([a-z0-9\.]+)/, isSomething);
make("Silk", /Silk\/(\d+\.\d+)/, isSilk);


module.exports = list;