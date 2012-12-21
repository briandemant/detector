"use strict";

var express = require('express');
var app = express();
var UaParser = require("./ua_parser.js");

var uaParser = new UaParser();

app.get('/', function (req, res) {
	var ua = uaParser.parse(req.query.ua|| req.headers['user-agent']);
	res.send(ua);
});

app.listen(3000);
