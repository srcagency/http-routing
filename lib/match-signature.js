'use strict';

var COLON = ':'.charCodeAt();
var SLASH = '/'.charCodeAt();
var QUEST = '?'.charCodeAt();

module.exports = match;

function match( signature, url ){
	var siglength = signature.length;
	var urlLength = url.length;
	var args = [];
	var arg = '';
	var query = '';
	var sc;
	var uc;

	// loop signature and URL both starting at index zero
	for (var i = 0, offset = 0;i < urlLength;i++) {
		sc = signature.charCodeAt(i - offset);
		uc = url.charCodeAt(i);

		if (sc === COLON) {
			// we are collecting an argument

			if (uc === SLASH || uc === QUEST) {
				// we have reached the end of the argument

				// bail on empty arguments
				if (arg === '')
					return false;

				args.push(arg);

				arg = '';

				// hold back url cursor ("replay")
				i--;

				// move signature cursor forward
				offset--;
			} else {
				arg += String.fromCharCode(uc);

				// hold signature cursor back
				offset++;
			}
		} else if (sc !== uc) {
			// indifference and not collecting an argument

			// it is not a querystring
			if (uc !== QUEST)
				return false;

			query = url.substr(i + 1);

			break;
		}
	}

	if (arg !== '') {
		args.push(arg);

		offset--;
	}

	if (i - offset < siglength)
		return false;

	return {
		args: args,
		query: query,
	};
}
