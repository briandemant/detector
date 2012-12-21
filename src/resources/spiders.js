"use strict";
var _ = require('lodash');

var list = [];

function make(family, osRegEx) {
	list.push({ detect: function (ua) {
		          var match = new RegExp(osRegEx).exec(ua.uaOriginal);
		          if (match) {
			          var version = ('' + match[1]).trim();
			          return {
				          version : version,
				          family  : family,
				          fullname: family + " " + version,
				          is      : {spider: true, unknown: false}
			          }
		          }
	          }
	     }
	);
}


make("cURL", /libcurl\/(\S+)/);
make("Monit", /monit\/(\S+)/);
make("Apache", /Apache(\S+)?/i);

module.exports = list;