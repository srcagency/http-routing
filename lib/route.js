'use strict';

var parse = require('./parse');

module.exports = route;

function route( method, definition, value ) {
	var tokens = parse(definition);

	return {
		method: method,
		signature: tokens.signature,
		params: tokens.params,
		value: value,
	};
}
