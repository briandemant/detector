"use strict";
var helpers = require("./tools/test_helpers.js");
var assert = helpers.assert;
var UaParser = require("../src/ua_parser.js");
var _ = require('lodash');


describe('correctness test', function() {


	it('should not throw on any from the complete list', function(done) {
		var uaParser = new UaParser();
		var items = require('./fixtures/fixtures_complete.json');

		var stat = {browsers : {}, os : {}};
		['unknown', 'tablet', 'desktop', 'mobile', 'spider', 'device', 'error'].forEach(function(section) {
			stat[section] = {count : 0, impressions : 0};
		});

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var result = uaParser.parse(item['useragent']);
			if (result.err) {
				if (result.err != 'User agent must be supplied') {
					console.log(result);
					throw result;
				} else {
					stat['error'].count++;
					stat['error'].impressions += item.count;
				}
			} else {
				['unknown', 'tablet', 'desktop', 'mobile', 'spider', 'device'].forEach(function(section) {
//					if (result.device) {
//						console.log("\n\n\n\n");
//						console.log(result);
//						console.log("\n\n\n\n");
//					}
					if (result.is[section]) {
						stat[section].count++;
						stat[section].impressions += item.count;
					}
				});
				stat.browsers[result.browser.family] = (stat.browsers[result.browser.family] | 0) + 1;
				stat.os[result.os.family] = (stat.os[result.os.family] | 0) + 1;
			}

		}
		console.log();
		
		console.log(stat);

		done();
	});

	it('should identify all from head', function(done) {
		var uaParser = new UaParser();
		var items = require('./fixtures/fixtures_head.json');

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var result = uaParser.parse(item['useragent']);
			assert.isSameUAStrict(item, result);
		}
		done();
	});
}); 