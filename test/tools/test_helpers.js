"use strict";
// force test config 
process.env.NODE_ENV = 'test';

var _ = require('lodash');
var microtime = require('microtime');
var assert = require("chai").assert;
require('colors');

var strictMap = _({
	                  browser : ['family', 'version' , 'fullname'],
	                  os : ['family', 'version' , 'fullname'],
	                  is : ['unknown', 'desktop', 'tablet', 'spider', 'mobile']
                  });

assert.isSameUAStrict = function(ua, expected) {
	assert.equal(ua.useragent, expected.useragent, 'useragent for ' + expected.useragent); 
	strictMap.each(function(list, section) {
		          var uaSection = ua[section];
		          var exSection = expected[section];
		          list.forEach(function(part) {
			          var uaValue = uaSection[part]; 
			          var expValue = exSection[part];
			          try {
				          assert.equal(uaValue, expValue, section + '.' + part + ' for ' + expected.useragent);
			          } catch (e) {
				          console.log("\nGot:".green);
				          console.log(ua);
				          console.log("\nExpected:".red);
				          console.log(expected);
				          console.log("\nError:", e.message.red, "\n");
				          throw e;
			          }
		          })
	          });
};
assert.isSameUA = function(ua, expected) {
	assert.equal(ua.useragent, expected.useragent, 'useragent for ' + expected.useragent);

	var isOk = false;
	['unknown', 'desktop', 'tablet', 'spider', 'mobile'].forEach(function(part) {
		var uaValue = ua.is[part];
		var expValue = expected.is[part];

		if (typeof uaValue !== 'undefined') {
			try {
				assert.equal(uaValue, expValue, 'is.' + part + ' for ' + expected.useragent);
				isOk = true;
			} catch (e) {
				console.log("\nGot:".green);
				console.log(ua.is);
				console.log("\nExpected:".red);
				console.log(expected.is);
				console.log("\nError:", e.message.red, "\n");
				throw e;
			}
		}
	});

	function reportError() {
		console.log(ua.useragent.red);
		console.log(ua);
		console.log(ua.is);
		console.log(expected.is);
		throw "what?"
	}

	if (!isOk) {
		if (ua.is.type === "Browser") {
			if (expected.is.desktop && !ua.os.name.match(/(mobile|ios|phone|tablet)/i) && !ua.browser.name.match(/(mobile|ios|phone|tablet)/i)) {
				// ok
			} else {
				reportError();
			}
		} else if (ua.is.type === "Mobile Browser") {
			if (expected.is.mobile && (ua.os.name.match(/(mobile)/i) || ua.browser.name.match(/(mobile)/i))) {
				// ok
			} else if (expected.is.tablet && (ua.useragent.match(/(ipad)/i) || ua.os.name.match(/(ipad)/i) || ua.browser.name.match(/(ipad)/i))) {
				// ok
			} else {
				reportError();
			}
		} else {
			reportError();
		}


		[ 'desktop', 'mobile', 'tablet', 'spider', 'unknown'].forEach(function(part) {
			ua.is[part] = expected.is[part];
		})
	}

	_({
		  browser : ['family', 'version' , 'fullname'],
		  os : ['family', 'name' , 'fullname']
	  }).each(function(list, section) {
		          list.forEach(function(part) {
			          var uaValue = ua[section][part];
			          var expValue = expected[section][part];
			          uaValue = typeof uaValue === 'undefined' ? false : uaValue;
			          expValue = typeof expValue === 'undefined' ? false : expValue;

			          try {
				          assert.equal(uaValue, expValue, section + '.' + part + ' for ' + expected.useragent);
			          } catch (e) {
				          console.log("\nGot:".green);
				          console.log(ua);
				          console.log("\nExpected:".red);
				          console.log(expected);
				          console.log("\nError:", e.message.red, "\n");
				          throw e;
			          }
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
assert.fasterThan = function(options, fn) {
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
	var result = {
		count : count,
		duration : (duration / 100 | 0) / 10,
		avg : (duration / count * 100 | 0) / 100 + " ms",
		hz : (count / duration * 1000 * 10000 | 0) / 10
	};

	assert.isTrue(result.hz > options.hz, "was too slow: expected " + options.hz + " was " + result.hz);
	return result;
};


module.exports = {
	assert : assert,
	fixtures : require('./fixtures.js')
};
