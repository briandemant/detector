"use strict";
var helpers = require("./tools/test_helpers.js");
var assert = helpers.assert;
var UaParser = require("../src/ua_parser.js");
var UserAgent = require("../src/user_agent.js");
var _ = require('lodash');


describe('basic api of ua_parser.js', function() {
	describe('general api', function() {
		it('parse is a function', function() {
			var uaParser = new UaParser();
			assert.isFunction(uaParser.parse);
		});

		it('should fail on missing input', function() {
			var uaParser = new UaParser();
			var result = uaParser.parse();

			assert.equal(result.err, "User agent must be supplied");
		});

		it('should fail on empty input', function() {
			var uaParser = new UaParser();
			var result = uaParser.parse("");

			assert.equal(result.err, "User agent must be supplied");
		});

		it('should resolve on input', function() {
			var uaParser = new UaParser();
			var result = uaParser.parse("something");

			assert.notProperty("err", result);
		});
	}); 
});