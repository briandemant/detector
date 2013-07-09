"use strict";

var UNKNOWN = "Unknown";
// the UserAgent is unidentified by default
function UserAgent(useragent) {
	this.useragent = useragent;
	// safe defaults 
	this.browser = {family: UNKNOWN, name: UNKNOWN};
	this.os = {family: UNKNOWN, name: UNKNOWN};
	this.is = {
		desktop: false,
		mobile : false,
		tablet : false,
		spider : false,
		unknown: true
	};
}

UserAgent.UNKNOWN = UNKNOWN;

UserAgent.prototype.toString = function () {
	return this.browser.full + " / " + this.os.full;
};

module.exports = UserAgent;