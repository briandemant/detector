"use strict";
var helpers = require("./tools/test_helpers.js");
var assert = helpers.assert;
var UserAgent = require("../src/user_agent.js");
var _ = require('lodash');


describe('user_agent.js', function () {
	describe('defaults / unknown', function () {
		it('default is unknown', function () {
			var ua = new UserAgent("does not compute");
			assert(ua.is.unknown, "is unknown");
			assert(!ua.is.desktop, "not desktop");
			assert(!ua.is.mobile, "not mobile");
			assert(!ua.is.tablet, "not tablet");
			assert(!ua.is.spider, "not spider");
		});
	});
}); 


