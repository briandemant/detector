"use strict";
var helpers = require("./test_helpers.js");
var assert = helpers.assert;
var UaParser = require("../../src/ua_parser.js");
require('colors');
var fs = require('fs');


//rl.question("What do you think of node.js? ", function(answer) {
//	// TODO: Log the answer in a database
//	console.log("Thank you for your valuable feedback:", answer);
//
//	rl.close();
//});


var fixtureFile = process.argv[2];
console.log("fixing " + fixtureFile);

var force = process.argv[3] == "-f";

var current = -1;
var uaParser = new UaParser();
var items = require("../../" + fixtureFile);
fs.createReadStream(fixtureFile).pipe(fs.createWriteStream(fixtureFile + "." + (+new Date() )));

function correct(result) {
	items[current].browser = result.browser;
	items[current].os = result.os;
	[ 'desktop', 'mobile', 'tablet', 'spider', 'unknown'].forEach(function(part) {
		items[current].is[part] = result.is[part];
	})
}

function saveResults() {
	rl.question("Save results?".yellow, function(answer) {
		if (answer == 'y') {
			console.log("Saving updated fixture".blue, answer);
			fs.writeFileSync(fixtureFile, JSON.stringify(items, null, 2));
			rl.close();
		} else if (answer == 'n') {
			console.log("Quitting without saving".red, answer);
			rl.close();
		} else {
			saveResults();
		}
	});
}
function processNext() {
	if (items.length == current + 1) {
		saveResults();
		return;
	}

	var item = items[++current]; 

	if (item.count < 100) {
		processNext();
		return;
	}

	var result = uaParser.parse(item.useragent);

	try {
		if (!force) {
			assert.isSameUA(item, result);
		}
		correct(result);
		processNext();
	} catch (e) {
		console.log("\n\n\n\n");
		console.log(result.useragent);
		if (item.browser.family != result.browser.family && item.browser.family != result.browser.name) {
			console.log(result.browser.family + " != " + item.browser.family);
			console.log(result.browser.name + " != " + item.browser.name);
		}
		if (parseFloat(item.browser.version) != parseFloat(result.browser.version)) {
			console.log(result.browser.version + " != " + item.browser.version);
		}
		rl.question("is this correct?".yellow, function(answer) {
			if (answer.length == 0) {
				console.log("ok".green);
				correct(result);
				processNext();
			} else {
				if (answer == 's') {
					saveResults();
				} else if (answer == 'u') {
					console.log("undo last".red, answer);
					current -= 2;
					processNext();
				} else {
					console.log("quitting without saving".red, answer);
					rl.close();
				}
			}
		});
	}

}


var rl = require('readline').createInterface({ input : process.stdin, output : process.stdout});

processNext();