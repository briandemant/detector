"use strict";
var helpers = require("./tools/test_helpers");
var assert = helpers.assert;
var config = require("../src/config");

describe('config.js', function () {
	it('helper should make config load "test" environment', function () {
		assert.equal(process.env.NODE_ENV, 'test');
		assert.equal(config.env, 'test');
		assert.isTrue(config.underTest);
	});
});

