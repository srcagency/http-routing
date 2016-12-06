'use strict';

var COLON = ':'.charCodeAt();
var SLASH = '/'.charCodeAt();
var QUEST = '?'.charCodeAt();

module.exports = parse;

function parse( definition ) {
	var signature = '/';
	var length = definition.length;
	var params = [];
	var i;
	var c;

	for (i = 0; i < length; i++) {
		c = definition.charCodeAt(i);

		if (c === SLASH) {
			if (i === 0)
				continue; // skip starting '/'

			if (name !== undefined) {  // end parsing a parameter
				storeParameter(params, name);
				name = undefined;
			}
		}

		if (name !== undefined) // parameter parsing "mode"
			name += String.fromCharCode(c);
		else // signature parsing "mode"
			signature += String.fromCharCode(c);

		if (c === COLON) // start parsing a parameter
			var name = '';

		if (c === QUEST)
			throw new Error('Unexpected token "?"');

		if (name !== undefined && i === length - 1) // add "last" parameter
			storeParameter(params, name);
	}

	return {
		params: params,
		signature: signature,
	};
}

function storeParameter( params, name ) {
	if (name === '')
		throw new Error('Anonymous parameters not allowed');

	params.push(name);
}
