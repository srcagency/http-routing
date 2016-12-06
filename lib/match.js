'use strict';

var signatureMatch = require('./match-signature');

module.exports = match;

function match( routes, method, url ) {
	var length = routes.length;
	var route;
	var i;

	for (i = 0; i < length; i++) {
		route = routes[i];

		if (route.method !== method)
			continue;

		var tokens = signatureMatch(route.signature, url);

		if (tokens !== false)
			return formatMatch(route, tokens);
	}
}

function formatMatch( route, tokens ) {
	return {
		method: route.method,
		signature: route.signature,
		params: route.params,
		value: route.value,
		args: tokens.args,
		query: tokens.query,
	};
}
