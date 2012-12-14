"use strict";
// force test config 
process.env.NODE_ENV = 'test';

var _ = require('lodash');
var microtime = require('microtime');
var assert = require("chai").assert;

assert.isSameUA = function (ua, expected) {
	assert.deepEqual(ua.original, expected.original, 'original for ' + expected.original);
	_({
		  browser: ['family', 'version', 'major', 'minor', 'patch', 'full'],
		  os     : ['family', 'version', 'major', 'minor', 'patch', 'full'],
		  is     : ['unknown']
	  }).each(function (list, section) {
		          list.forEach(function (part) {
			          var uaValue = ua[section][part];
			          var expValue = expected[section][part];
			          assert.equal(uaValue, expValue, section + '.' + part + ' for' + expected.original + "\n");
		          })
	          });
};

assert.fasterThan = function (options, fn) {
	var count = 0;
	var start = microtime.now();
	var end = microtime.now() + options.timeout * 1000;
	while (end > microtime.now()) {
		if (options.items) {
			for (var i = options.items.length; i--;) {
				fn(options.items[i]);
				count++;
				if (end <= microtime.now()) {
					break;
				}
			}
		} else {
			fn();
			count++;
			if (end <= microtime.now()) {
				break;
			}
		}

	}

	var duration = microtime.now() - start;
	var result = {
		count   : count,
		duration: (duration / 100 | 0) / 10,
		avg     : (duration / count * 100 | 0) / 100 + " ms",
		hz      : (count / duration * 1000 * 10000 | 0) / 10
	};

	assert.isTrue(result.hz > options.hz, "was too slow: expected " + options.hz + " was " + result.hz);
	return result;
};


module.exports = {
	assert  : assert,
	fixtures: require('./fixtures.js')
};
