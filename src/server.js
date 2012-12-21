"use strict";

var express = require('express');
var app = express();
var UaParser = require("./ua_parser.js");

var uaParser = new UaParser();

var cluster = require('cluster');

var optimist = require('optimist')
		.usage('Usage: $0 [-port num] [-forks num]')
		.options('p', {
			         alias   : 'port',
			         default : 7101,
			         describe: 'Which port to listen on'
		         })
		.options('f', {
			         alias   : 'forks',
			         default : 2,
			         describe: 'How many forks of the process should be made'
		         })
		.options('h', {
			         alias   : 'help',
			         describe: 'you need help explained?'
		         });
;

var port = optimist.argv.port;
var forks = optimist.argv.forks;

if (optimist.argv.h) {
	optimist.showHelp();
	process.exit();
}


if (cluster.isMaster) {
	for (var i = 0; i < forks; ++i) {
		cluster.fork();
	}
} else {

	app.get('/', function (req, res) {
		var ua = uaParser.parse(req.query.ua || req.headers['user-agent']);
		res.send(ua);
	});

	app.listen(port, function () {
		if (cluster.worker.id == 1) {
			process.stdout.write("Server listening on port " + port + "\n");
		}
		process.nextTick(function () {
			process.stdout.write(".");
			if (cluster.worker.id == forks) {
				process.nextTick(function () {
					process.stdout.write(" ready\n");
				})
			}
		})
	});
}