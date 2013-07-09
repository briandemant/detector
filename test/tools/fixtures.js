"use strict";
var _ = require('lodash');

var tablets = [];
var mobiles = [];
var spiders = [];


var browsers = [
	{
		useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.5; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
		browser : {family: 'Firefox', version: "4.0.1" },
		os      : {family: 'Mac OS X', version: "10.5" },
		is      : {unknown: false, browser: true}   },
	{
		useragent: 'Mozilla/5.0 (X11; U; Linux x86_64; cs-CZ; rv:1.9.1.7) Gecko/20100106 Ubuntu/9.10 (karmic) Firefox/3.5.7',
		browser : {family: 'Firefox', version: "3.5.7"},
		os      : {family: 'Ubuntu', version: '9.10'},
		is      : {unknown: false, browser: true}   }
];

var tablets = [
	{
		useragent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.5; rv:2.0.1) Gecko/20100101 Firefox/4.0.2',
		browser : {family: 'Firefox', version: "4.0.2" },
		os      : {family: 'Mac OS X', version: "10.5" },
		is      : {unknown: false, browser: true}   }

];

function expandInfo(item) {
	var version = item.version.split('.');
	item.major = version[0] | 0;
	item.minor = version[1] | 0;
	item.patch = version[2];
	item.full = item.family + ' ' + item.version;
}
function expandInfos(items) {
	items.forEach(function (item) {
		expandInfo(item.browser);
		expandInfo(item.os);
	});
}


var mixed = [];
[browsers, tablets, mobiles, spiders].forEach(function (list) {
	expandInfos(list);
	list.forEach(function (item) {
		mixed.push(item);
	});
});

module.exports = {
	GARBLED_UA: "NotYourBrowser",
	browsers  : browsers,
	tablets   : tablets,
	mobiles   : mobiles,
	spiders   : spiders,
	mixed     : mixed
};
