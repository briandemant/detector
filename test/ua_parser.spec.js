"use strict";
var helpers = require("./tools/test_helpers.js");
var assert = helpers.assert;
var UaParser = require("../src/ua_parser.js");
var UserAgent = require("../src/user_agent.js");
var _ = require('lodash');


describe('basic api of ua_parser.js', function () {
	describe('general api', function () {
		it('parse is a function', function () {
			var uaParser = new UaParser();
			assert.isFunction(uaParser.parse);
		});

		it('should fail on missing input', function () {
			var uaParser = new UaParser();
			var result = uaParser.parse();

			assert.equal(result.err, "User agent must be supplied");
		});

		it('should fail on empty input', function () {
			var uaParser = new UaParser();
			var result = uaParser.parse("");

			assert.equal(result.err, "User agent must be supplied");
		});

		it('should resolve on input', function () {
			var uaParser = new UaParser();
			var result = uaParser.parse("something");

			assert.notProperty("err", result);
		});
	});

	describe('os fixtures', function () {
		it('should detect all correctly', function (done) {
			var uaParser = new UaParser();
			var items = require('./fixtures/fixtures_head.json');

			var stat = {browsers: {}, os: {}};
			['tablet', 'desktop', 'mobile', 'spider'].forEach(function (section) {
				stat[section] = {count: 0, impressions: 0};
			})
			var res = assert.fasterThan({items: items, timeout: 500, hz: 1500}, function (data) {
				var result = uaParser.parse(data['useragent']);
				assert.notProperty(result, "err", "failed on " + data['useragent']);
				['tablet', 'desktop', 'mobile', 'spider'].forEach(function (section) {
					if (result.is[section]) {
						stat[section].count++;
						stat[section].impressions += data.count;
					}
				})
				stat.browsers[result.browser.family] = (stat.browsers[result.browser.family] | 0) + 1;
				stat.os[result.os.family] = (stat.os[result.os.family] | 0) + 1;
			})

			console.dir(res);
			console.dir(stat);

			done();
		});

	});
});