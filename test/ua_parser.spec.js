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

		it('should fail on missing input', function (done) {
			var uaParser = new UaParser();
			var promise = uaParser.parse();

			promise.then(function () {
				done(new Error("should not call then"));
			}, function (msg) {
				if (msg === "User agent must be supplied") {
					done();
				}
				else {
					done(new Error("msg is not as espected : '" + msg + "'"));
				}
			});
		});
		it('should fail on empty input', function (done) {
			var uaParser = new UaParser();
			var promise = uaParser.parse("");

			promise.then(function () {
				done(new Error("should not call then"));
			}, function (msg) {
				if (msg === "User agent must be supplied") {
					done();
				}
				else {
					done(new Error("msg is not as espected : '" + msg + "'"));
				}
			});
		});

		it('should resolve on input', function (done) {
			var uaParser = new UaParser();
			var promise = uaParser.parse("something");

			promise.then(function (ua) {
				if (ua instanceof UserAgent) {
					done();
				} else {
					done(new Error("should provide an unknown UserAgent object"));
				}
			}, function (msg) {
				done(new Error("should not call error : " + msg));
			});
		});
	});
});