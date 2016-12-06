'use strict';

var test = require('tape');
var route = require('../lib/route');

function testRoute(t, method, definition ,value, expected) {
	var actual = route(method, definition, value);
	t.deepEqual(actual, expected, method + ' ' + definition + ' '
		+ value.toString());
}

var noop = Function.prototype;

test('route', function(t) {
	t.plan(11);

	testRoute(t, 'OPTIONS', '/', noop,
		{ method: 'OPTIONS', signature: '/', params: [], value: noop});

	testRoute(t, 'GET', '/', noop,
		{ method: 'GET', signature: '/', params: [], value: noop});

	testRoute(t, 'GET', '/profile', noop,
		{ method: 'GET', signature: '/profile',
			params: [], value: noop});

	testRoute(t, 'GET', '/products/:pk', noop,
		{ method: 'GET', signature: '/products/:', params: ['pk'],
			value: noop});

	testRoute(t, 'GET', '/products/:pk/details/:country', noop,
		{ method: 'GET', signature: '/products/:/details/:',
			params: ['pk', 'country'], value: noop});

	testRoute(t, 'GET', '/', { title: "Hello World" },
		{ method: 'GET', signature: '/', params: [],
			value: { title: "Hello World"}});

	testRoute(t, 'HEAD', '/', noop,
		{ method: 'HEAD', signature: '/', params: [], value: noop});

	testRoute(t, 'POST', '/', noop,
		{ method: 'POST',signature: '/', params: [], value: noop});

	testRoute(t, 'POST', '/files', noop,
		{ method: 'POST',signature: '/files', params: [], value: noop});

	testRoute(t, 'PUT', '/', noop,
		{ method: 'PUT', signature: '/', params: [], value: noop});

	testRoute(t, 'DELETE', '/', noop,
		{ method: 'DELETE', signature: '/', params: [], value: noop});
});
