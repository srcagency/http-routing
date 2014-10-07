'use strict';

var Router = require('../');
var Route = Router.Route;
var tape = require('tape');

tape.test('router', function( t ){
	var router = new Router();

	router.add([
		Route('/'),
		Route('/products'),
		Route('/products/:pk'),
		Route('POST:/products/:pk'),
		Route('PUT:/products/:pk'),
		Route('/people'),
		Route.post('/people'),
		Route.put('/articles/:pk', function( pk, next ){
			t.equal(this.secret, 123);
			t.equal(pk, '321');
			t.equal(typeof next, 'function');
		}),
	]);

	t.deepEqual(router.match('/').params, []);

	t.deepEqual(router.match('/products').params, []);
	t.deepEqual(router.match('/products/123').params, [ '123' ]);
	t.deepEqual(router.match('/products/123', 'GET').params, [ '123' ]);
	t.deepEqual(router.match('/products/123', 'POST').params, [ '123' ]);
	t.deepEqual(router.match('/products/123', 'PUT').params, [ '123' ]);

	var A = Route('/people/:age');
	var B = Route('/people/:height');

	router
		.add(A)
		.add(B);

	t.deepEqual(router.match('/people').params, []);
	t.deepEqual(router.match('/people', 'POST').params, []);
	t.notOk(router.match('/people', 'PUT'));

	t.deepEqual(router.match('/people/32').route, A);

	t.deepEqual(router.match('/people/32').next().route, B);

	router.run('/articles/321', 'PUT', { secret: 123 });

	t.end();
});
