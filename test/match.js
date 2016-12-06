'use strict';

var test = require('tape');
var merge = require('merge');
var match = require('../lib/match');
var route = require('../lib/route');

function testMatch(t, routes, method, url, expected) {
	var result = match(routes, method, url);
	t.deepEqual(result, expected,
		method + ' ' + url);
}

test('match', function(t) {
	var routes = [];

	t.equal(match(routes, 'GET', '/'), undefined, 'routes = []');

	var index = route('GET', '/', {});
	routes.push(index);

	testMatch(t, routes, 'GET', '/',
		merge(index, {args: [], query: ''}));

	testMatch(t, routes, 'GET', '/?',
		merge(index, {args: [], query: ''}));

	testMatch(t, routes, 'GET', '/?start=10',
		merge(index, {args: [], query: 'start=10'}));


	var cities = route('GET', '/cities', {});
	routes.push(cities);

	testMatch(t, routes, 'GET', '/cities',
		merge(cities, {args: [], query: ''}));

	testMatch(t, routes, 'GET', '/cities?start=10',
		merge(cities, {args: [], query: 'start=10'}));


	var product = route('GET', '/products/:pk', {});
	routes.push(product);

	testMatch(t, routes, 'GET', '/products/1',
		merge(product, {args: ['1'], query: ''}));

	testMatch(t, routes, 'GET', '/products/12',
		merge(product, {args: ['12'], query: ''}));

	testMatch(t, routes, 'GET', '/products/223',
		merge(product, {args: ['223'], query: ''}));

	testMatch(t, routes, 'GET', '/products/223?start=10',
		merge(product, {args: ['223'], query: 'start=10'}));

	testMatch(t, routes, 'GET', '/products/223?start=10/foo',
		merge(product, {args: ['223'], query: 'start=10/foo'}));

	var stock = route('GET', '/stock/:country/:city', {});
	routes.push(stock);

	testMatch(t, routes, 'GET', '/stock/France/Paris',
		merge(stock, {args: ['France', 'Paris'], query: ''}));

	testMatch(t, routes, 'GET', '/stock/France/Paris?start=10&limit=10',
		merge(stock, {args: ['France', 'Paris'],
			query: 'start=10&limit=10'}));

	var alternating = route('GET', '/users/:pk/photos/:pk', {});
	routes.push(alternating);

	testMatch(t, routes, 'GET', '/users/1/photos/2',
		merge(alternating, {args: ['1', '2'], query: ''}));
	testMatch(t, routes, 'GET', '/users/12/photos/34',
		merge(alternating, {args: ['12', '34'], query: ''}));
	testMatch(t, routes, 'GET', '/users/123/photos/1',
		merge(alternating, {args: ['123', '1'], query: ''}));

	var signatureEqURL = route('GET', '/users/:pk/photos/:pk', {});
	routes.push(alternating);

	testMatch(t, routes, 'GET', '/users/:pk/photos/:pk',
		merge(signatureEqURL, {args: [':pk', ':pk'], query: ''}));

	testMatch(t, routes, 'GET', '/users//', undefined);

	var post = route('POST', '/users', {});
	routes.push(post);

	testMatch(t, routes, 'POST', '/users',
		merge(post, {args: [], query: ''}));

	var put = route('OPTIONS', '/users', {});
	routes.push(put);

	testMatch(t, routes, 'OPTIONS', '/users',
		merge(put, {args: [], query: ''}));

	t.end();
});
