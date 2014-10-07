'use strict';

var Route = require('../').Route;
var tape = require('tape');

tape.test('route', function( t ){
	var route = Route('/');

	t.equal(route.verb, 'GET');
	t.equal(route.query, false);
	t.equal(route.signature, '/');
	t.deepEqual(route.params, []);

	t.deepEqual(route.match('/'), []);
	t.notOk(route.match('/profile'));
	t.notOk(route.match('/?sort=price'));

	route = Route('/products');

	t.equal(route.verb, 'GET');
	t.equal(route.signature, '/products');
	t.deepEqual(route.params, []);

	t.deepEqual(route.match('/products'), []);
	t.notOk(route.match('/people'));
	t.notOk(route.match('/products?sort=price'));

	route = Route('POST:/products');

	t.equal(route.verb, 'POST');
	t.equal(route.signature, '/products');
	t.deepEqual(route.params, []);

	t.deepEqual(route.match('/products'), []);
	t.notOk(route.match('/people'));
	t.notOk(route.match('/products?sort=price'));
	t.deepEqual(route.match('/products', 'POST'), []);
	t.notOk(route.match('/products', 'GET'));
	t.notOk(route.match('/people', 'GET'));

	route = Route(':/products');

	t.equal(route.verb, 'GET');
	t.equal(route.signature, '/products');
	t.deepEqual(route.params, []);

	route = Route('/products/:pk');

	t.equal(route.signature, '/products/:');
	t.deepEqual(route.params, [ 'pk' ]);

	t.deepEqual(route.match('/products/532'), [ '532' ]);
	t.notOk(route.match('/products/532/'));
	t.notOk(route.match('/products/'));
	t.notOk(route.match('/products'));
	t.notOk(route.match('/products/532?sort=price'));

	route = Route('/products/:pk/');

	t.equal(route.signature, '/products/:/');
	t.deepEqual(route.params, [ 'pk' ]);

	t.deepEqual(route.match('/products/532/'), [ '532' ]);
	t.notOk(route.match('/products/532'));
	t.notOk(route.match('/products/532/?sort=price'));

	route = Route('/products/:pk/end');

	t.deepEqual(route.match('/products/532/end'), [ '532' ]);
	t.notOk(route.match('/products/532'));
	t.notOk(route.match('/products/532/end?sort=price'));

	t.equal(route.signature, '/products/:/end');
	t.deepEqual(route.params, [ 'pk' ]);

	route = Route('/products/:pk/:size');

	t.equal(route.signature, '/products/:/:');
	t.deepEqual(route.params, [ 'pk', 'size' ]);

	t.deepEqual(route.match('/products/532/small'), [ '532', 'small' ]);
	t.notOk(route.match('/products/532/small/'));
	t.notOk(route.match('/products/532/small/other'));

	route = Route('/?');

	t.equal(route.signature, '/');
	t.deepEqual(route.query, true);
	t.deepEqual(route.params, []);

	t.deepEqual(route.match('/'), []);
	t.deepEqual(route.match('/?'), []);
	t.deepEqual(route.match('/?name=brian'), []);
	t.notOk(route.match('/a?'));

	route = Route('/products?');

	t.equal(route.signature, '/products');
	t.deepEqual(route.query, true);
	t.deepEqual(route.params, []);

	t.deepEqual(route.match('/products'), []);
	t.deepEqual(route.match('/products?'), []);
	t.deepEqual(route.match('/products?name=brian'), []);

	route = Route('/products/?');

	t.equal(route.signature, '/products/');
	t.deepEqual(route.query, true);
	t.deepEqual(route.params, []);

	t.deepEqual(route.match('/products/'), []);
	t.deepEqual(route.match('/products/?'), []);
	t.deepEqual(route.match('/products/?name=brian'), []);

	route = Route('/products/:sort?');

	t.equal(route.signature, '/products/:');
	t.deepEqual(route.query, true);
	t.deepEqual(route.params, [ 'sort' ]);

	t.deepEqual(route.match('/products/price'), [ 'price' ]);
	t.deepEqual(route.match('/products/price?'), [ 'price' ]);
	t.deepEqual(route.match('/products/price?name=brian'), [ 'price' ]);

	route = Route('/products/:sort/?');

	t.equal(route.signature, '/products/:/');
	t.deepEqual(route.query, true);
	t.deepEqual(route.params, [ 'sort' ]);

	t.deepEqual(route.match('/products/price/?name=brian'), [ 'price' ]);

	t.end();
});
