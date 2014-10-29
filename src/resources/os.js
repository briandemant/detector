"use strict";
var _ = require('lodash');

var list = [];
function make(family, is, osRegEx, fn) {
	list.push({ detect: function (ua) {
		
		var match = new RegExp(osRegEx).exec(ua.useragent);
		if (match) {
			if (fn) {
				return fn(family, is, match, ua);
			}
			return {
				name  : family,
				family: family,
				is    : is
			}
		}
	}, regex : osRegEx
	          });
}
var desktop = {desktop: true};
var tablet = {tablet: true};
var mobile = {mobile: true};


function isAppleGadget(family, is, match) {
	return {
		name  : family,
		family: family,
		version: match[1],
		is    : is
	}
}

//http://en.wikipedia.org/wiki/Android_version_history#Android_1.0
var androidMap = {
	"4.2": "4.2 Jelly Bean",
	"4.1": "4.1.x Jelly Bean",
	"4.0": "4.0.x Ice Cream Sandwich",
	"3.2": "3.x Honeycomb",
	"3.1": "3.x Honeycomb",
	"3.0": "3.x Honeycomb",
	"2.3": "2.3.x Gingerbread",
	"2.2": "2.2.x Froyo",
	"2.1": "2.0/1 Eclair",
	"2.0": "2.0/1 Eclair",
	"1.6": "1.6 Donut",
	"1.5": "1.5 Cupcake",
	"1.1": "1.1",
	"1.0": "1.0"
}
function isAndroid(family, is, match, ua) {
	var version = match[1];
	if (_.isUndefined(version)) {
		return {
			//name  : "Generic " + family,
			name  : family,
			family: family,
			is    : mobile
		}
	}
	if (androidMap[version]) {
		version = androidMap[version];
	}

	// https://developers.google.com/chrome/mobile/docs/user-agent
	var is = mobile;
	if (ua.useragent.indexOf("Mobile") === -1) {
		is = tablet;
	}


	return {
		name  : family + " " + version,
		family: family,
		is    : is
	}
}

// http://en.wikipedia.org/wiki/List_of_Microsoft_Windows_versions
var winMap = {
	"95"          : "95",
	"ME"          : "ME",
	"98"          : "98",
	"NT 4.0"      : "NT",
	"NT 5.0"      : "2000",
	"NT 5.1"      : "XP",
	"NT 5.2"      : "2003 Server",
	"NT 6.0"      : "Vista",
	"NT 6.1"      : "7",
	"NT 6.2"      : "8",
	"NT 6.3"      : "8.1",
	"NT 6.4"      : "10",
	"NT 6.5"      : "??",
	"Phone OS 7.5": "Phone 7",
	"Phone 8.0"   : "Phone 8"
}
var winPhone = new RegExp("(Phone|ZuneWP7)", "i");
var notWindows = new RegExp("(xbox)", "i");
function isWindows(family, is, match, ua) {
	var version = match[1];

	if (!winMap[version] || notWindows.exec(ua.useragent)) {
		//console.dir(match);
		//process.exit();
		return false;
	}
	var is = desktop;
	if (winPhone.exec(ua.useragent)) {
		is = mobile;
		if (version === 'NT 6.1') {
			version = 'Phone OS 7.5';
		}
	}


	return {
		name    : family + " " + winMap[version],
//		fullname: family + " " + winMap[version],
		family  : family,
		version  : winMap[version],
		is      : is
	}
}
var osxMap = {
	"10.10": "10.10 Yosemite",
	"10.9": "10.9 Mavericks",
	"10.8": "10.8 Mountain Lion",
	"10.7": "10.7 Lion",
	"10.6": "10.6 Snow Leopard",
	"10.5": "10.5 Leopard",
	"10.4": "10.4 Tiger",
	";"   : ""
}
function isOSX(family, is, match) {
	var version = match[1].replace('_', '.').trim();
	var namedVersion = version;
	if (osxMap[version]) {
		namedVersion = osxMap[version];
	}
	return {
		name   : family + " " + namedVersion,
		family : family,
		version: version,
		is     : desktop
	}
}


var linuxMap = new RegExp("(ubuntu)", "i");

function isLinux(family, is, match, ua) {
	var name = family;
	var match = linuxMap.exec(ua.useragent);
	if (match) {
		name = match[1];
	}
	return {
		name    : name,
//		fullname: family,
		family  : family,
		is      : mobile
	}
}


function isA(kind) {
	return function (family) {
		var name = family;
		var is = {};
		is[kind] = true;
		return {
			name  : name,
			family: family,
			is    : is
		}
	}
}


make("Windows", null, /Windows ((?:NT|Phone(?: OS)?) \d+(?:\.\d+)?)/, isWindows);

make("iOS", tablet, /iPad;(?: U;)? CPU OS (\d+)/, isAppleGadget);
make("iOS", mobile, /i(?:Phone|Pod);(?: U;)?(?: CPU (?:iPhone)? OS (\d+))?/, isAppleGadget);

make("OS X", desktop, /OS X( 10.\d+|;)/, isOSX);
make("Android", null, /Android(?: (\d+\.\d+))?/, isAndroid);


make("Linux", desktop, /Linux (?:x86_64|i686|2|3)|pc-linux|(?:X11|DirectFB); Linux/, isLinux);

make("Blackberry", null, /RIM Tablet OS (\d+(?:\.\d+)?)/, isA('tablet'));
make("BlackBerry", null, /BlackBerry/, isA('mobile'));

make("Symbian", null, /SymbOS|Symbian/, isA('mobile'));

make("Playstation", null, /PLAYSTATION (\d+(?:\.\d+)?)/, isA('desktop'));
make("Xbox", null, /Xbox/, isA('desktop'));
make("JVM", null, /J2ME\/MIDP;/, isA('mobile'));
make("SmartTv", null, /SmartTV/, isA('desktop'));

make("Windows", null, /Windows (..)/, isWindows);
make("Chrome OS", null, /X11; CrOS/, isA('tablet'));

module.exports = list;

 