"use strict";
var helpers = require("./tools/test_helpers.js");
var assert = helpers.assert;
var uaParser = require("../src/ua-parser.js");
var _ = require('lodash');


describe('ua-parser.js', function () {
	describe('general api', function () {
		it('parse is a function', function () {
			assert.isFunction(uaParser.parse);
		});
		it('should throw on no input', function () {
			assert.throws(uaParser.parse, /no input/);
		});

		it('should throw on empty input', function () {
			assert.throws(function () {
				uaParser.parse("");
			});
		});
		it('should NOT throw on input', function () {
			uaParser.parse("some input");
		});
	}); 
});

