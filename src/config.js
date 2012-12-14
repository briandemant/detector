"use strict";

// Load the config suitable for the NODE_ENV environment
// defaults to production

var env = process.env.NODE_ENV || 'production';
var config;

try {
	var configPath = '../config/' + env + '.js';
	config = require(configPath);
	config.env = env; 
	config.package = require("../package.json");
} catch (er) {
	console.error('Warning: No configuration found.  Not suitable for production use.');
	console.error(er);
	process.exit(1);
}


module.exports = config;

if (!module.parent) {
	// just show the configs
	console.log("Config for the '" + env + "' environment");
	console.log(config);
	process.exit(0)
}
