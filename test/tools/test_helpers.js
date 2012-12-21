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

/**
 * items (optional) : list of items to iterate on .. the fn is called with each item until timeout
 *                  : if the list is exchausted
 * timeout          : max running time .. does not fail the test but limits the running time of the test
 * hz               : the expected minimum freq of the iteration starts over
 *
 * usage:
 var res = assert.fasterThan({items: os, timeout: 2000, hz: 1000}, function (data) {
				var result = uaParser.parse(data['useragent']);
				assert.notProperty(result, "err", "failed on " + data['useragent']);
			})
 */
assert.fasterThan = function (options, fn) {
	var count = 0;
	var start = microtime.now();
	var end = start + options.timeout * 1000;
 
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
	console.log(duration);
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
