"use strict";
var helpers = require("./tools/test_helpers.js");
var assert = helpers.assert;
var UaParser = require("../src/ua_parser.js");
var UserAgent = require("../src/user_agent.js");
var _ = require('lodash');


describe('speed test', function() {
	it('should detect all from head are fast', function(done) {
		var uaParser = new UaParser();
		var items = require('./fixtures/fixtures_head.json');

		var res = assert.fasterThan({items : items, timeout : 500, hz : 5000}, function(data) {
			var result = uaParser.parse(data['useragent']);
			assert.notProperty(result, "err", "failed on " + data['useragent']);
		});

		assert.isTrue(res.count > items.length, "All entries from fixture must be exercized (got " + res.count + " of " + items.length + ")");

		done();
	});
}); 