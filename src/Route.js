'use strict';

var methods = require('methods');

module.exports = Route;

function Route( definition, fn, opts ){
	if (definition instanceof Route)
		return definition;

	if (!(this instanceof Route))
		return new Route(definition);

	var type = typeof definition;
	var attrs;

	if (type === 'string')
		attrs = parse(definition);
	else if (type === 'object')
		attrs = definition;
	else
		throw new Error('Cannot add route from a definition of type "' + type + '"');

	this.verb = (opts && opts.verb) || attrs.verb || 'GET';
	this.query = attrs.query || false;
	this.signature = attrs.signature || '/';
	this.params = attrs.params || [];
	this.fn = fn;
}

methods
	.forEach(function( verb ){
		var verbUc = verb.toUpperCase();

		Route[verb] = function( definition, fn ){
			return new Route(definition, fn, { verb: verbUc });
		};
	});

var cA = 'A'.charCodeAt();
var cZ = 'Z'.charCodeAt();
var cColon = ':'.charCodeAt();
var cSlash = '/'.charCodeAt();
var cQuest = '?'.charCodeAt();

Route.prototype.match = function( url, verb ){
	var urlLength = url.length;
	var signatureLength = this.signature.length;
	var params = [];
	var offset = 0;
	var found = 0;
	var sc;
	var uc;
	var pc;

	if (this.verb !== null && verb !== undefined && verb !== this.verb)
		return false;

	// i = 1 to skip leading slash
	for (var i = 1;i < signatureLength;i++) {
		sc = this.signature.charCodeAt(i);
		uc = url.charCodeAt(i + offset);

		if (sc !== uc) {
			if (sc === cColon) {
				params[found] = String.fromCharCode(uc);

				for (;i + offset + 1 < urlLength;offset++) {
					pc = url.charCodeAt(i + offset + 1);

					if (pc === cSlash || pc === cQuest)
						break;

					params[found] += String.fromCharCode(pc);
				}

				found++;
			} else {
				return false;
			}
		}
	}

	if (i + offset !== urlLength && (!this.query || url.charCodeAt(i + offset) !== cQuest))
		return false;

	return params;
};

function parse( definition ) {
	var length = definition.length;
	var verb = '';
	var params = [];
	var signature = '/';
	var query = false;
	var i = 0;
	var name;
	var c;

	for (;i < length;i++) {
		c = definition.charCodeAt(i);

		if (c === cColon) {
			i++;
			break;
		}

		if (c < cA || c > cZ) {
			verb = null;
			i = 0;
			break;
		}

		verb += String.fromCharCode(c);
	}

	if (definition.charCodeAt(i) === cSlash)
		i++;

	for (;i < length;i++) {
		c = definition.charCodeAt(i);

		if (c === cColon) {
			signature += ':';
			name = '';

			for (;i + 1 < length;i++) {
				c = definition.charCodeAt(i + 1);

				if (c === cSlash || c === cQuest)
					break;

				name += String.fromCharCode(c);
			}

			if (name === '')
				throw new Error('Anonymous parameters not allowed');

			params.push(name);

			continue;
		} else if (c === cQuest) {
			if (i !== length - 1)
				throw new Error('Unexpected token "?"');

			query = true;
			break;
		} else {
			signature += String.fromCharCode(c);
		}
	}

	return {
		verb: verb,
		query: query,
		signature: signature,
		params: params,
	};
}
