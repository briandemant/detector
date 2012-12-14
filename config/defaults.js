"use strict";

module.exports = {
	name   : 'detetcor',
	port   : 3000,
	cluster: { size: require("os").cpus().length },

	email: {
		from: '"The Detector Website Robot" <interetalert@fynskemedier.dk>',
		to  : 'interetalert@fynskemedier.dk'
	},

	redis: { host: '127.0.0.1', port: 6379 }
};