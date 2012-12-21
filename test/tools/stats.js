"use strict";
var helpers = require("./test_helpers.js");
var assert = helpers.assert;
var UaParser = require("../../src/ua_parser.js");
var _ = require('lodash');

var skip = -1;

var items = require('../fixtures/fixtures_complete.json');

var uaParser = new UaParser();
var count = 0;
var impressions = {};

function onlyOneKind(ua) {
	//return ua.is.desktop ^ ua.is.mobile ^ ua.is.tablet ^ ua.is.spider || ~(ua.is.desktop & ua.is.mobile & ua.is.tablet & ua.is.spider);
	if (ua.is.desktop && ua.is.mobile) {
		return false;
	}
	if (ua.is.desktop && ua.is.tablet) {
		return false;
	}
	if (ua.is.desktop && ua.is.spider) {
		return false;
	}
	if (ua.is.mobile && ua.is.tablet) {
		return false;
	}
	if (ua.is.mobile && ua.is.spider) {
		return false;
	}
	if (ua.is.tablet && ua.is.spider) {
		return false;
	}
	return  ua.is.desktop || ua.is.mobile || ua.is.tablet || ua.is.spider;
}

items.forEach(function (item, idx) {
	if (idx <= skip) {

		if (idx == skip) {
			var ua = uaParser.parse(item["useragent"]);
			console.dir(ua);
		}
		return;
	}
	if (count++ % 100 == 0) {
		process.stderr.write(".");

		if (count % 10000 == 0) {
			process.stderr.write("\n");
		}
	}

	var ua = uaParser.parse(item["useragent"]);
	impressions["total"] = (impressions["total"] | 0) + item.count;
	if (ua.err) {
		impressions["fail"] = (impressions["fail"] | 0) + item.count;
		return; // ignore errors
	}
 
	if (!onlyOneKind(ua) && !ua.is.unknown) {
		console.log("ERROR : NO PLATFORM OR MORE THAN ONE PLATFORM");

		console.dir(ua);
		process.exit();
	}

	if (ua.is.spider || ua.is.device) {

		['spider', 'device'].forEach(function (section) {
			if (ua.is[section]) {
				impressions[section] = (impressions[section] | 0) + item.count;
			}
		})
	}	else if (ua.is.unknown) {
		impressions['unknown'] = (impressions['unknown'] | 0) + item.count;
		console.dir(ua);
	} else  { 
		['desktop', 'mobile', 'tablet'].forEach(function (section) {
			if (ua.is[section]) {
				impressions[section] = (impressions[section] | 0) + item.count;
			}
		}); 
	}
});


process.stderr.write("\nDONE!\n");
process.stderr.write("\nimpressions : " + (impressions["total"] / 100000 | 0) / 10 + " mill\n");

function printSection(section) {
	var total = impressions["total"];
	var count = impressions[section]|0;
	process.stderr.write(section + " : " + count  + " (" + Math.round(count / total * 10000) / 100 + " %)\n");
	//process.stderr.write(section + " : " + (count/1000) + " af " + (total/1000) + "\n");
//	process.stderr.write(impressions['total'] + "\n");
//	process.stderr.write((count/10|0)/10 + "\n");
}
['desktop', 'mobile', 'tablet', 'spider', 'device', 'fail', 'unknown'].forEach(function (section) {
	printSection(section);
});

