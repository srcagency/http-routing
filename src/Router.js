'use strict';

var methods = require('methods');

module.exports = Router;

var Route = Router.Route = require('./Route');

function Router( routes, catchAll ){
	if (!(this instanceof Router))
		return new Router(routes);

	this.routes = routes || [];
	this.fallback = catchAll;
}

Router.prototype = {
	add: add,
	catchAll: catchAll,
	match: match,
	run: run,
};

methods
	.forEach(function( verb ){
		var verbUc = verb.toUpperCase();

		Router.prototype[verb] = function( definition, fn ){
			this.add(new Route(definition, fn, { verb: verbUc }));
			return this;
		};
	});

function add( routes ){
	Array.prototype.push.apply(this.routes, Array.isArray(routes) ? routes : [ routes ]);

	return this;
}

function catchAll( catchAll ){
	this.fallback = catchAll;

	return this;
}

function match( url, verb, startAt ){
	var routesLength = this.routes.length;
	var params;

	for (var i = startAt || 0;i < routesLength;i++) {
		if (params = this.routes[i].match(url, verb))
			return {
				router: this,
				url: url,
				verb: verb,
				idx: i,
				next: next,
				route: this.routes[i],
				params: params,
			};
	}
};

function run( url, verb, ctx ){
	var match = this.match(url, verb);

	if (match) {
		match.params.push(match.next);

		return match.route.fn.apply(ctx, match.params);
	} else if (this.fallback) {
		return this.fallback.call(ctx);
	}
}

function next(){
	return Router.prototype.match.call(this.router, this.url, this.verb, this.idx + 1);
}
