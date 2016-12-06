'use strict';

var test = require('tape');
var parse = require('../lib/parse');

function testParse(t, definition, expected) {
	var actual = parse(definition);
	t.deepEqual(actual, expected, definition);
}

function testParseError(t, definition) {
	t.throws(parse.bind(null, definition),
		/Anonymous parameters not allowed/,
		definition);
}

test('parse', function(t) {
	t.plan(29);

	testParse(t,'', { signature: '/', params: [] });

	testParse(t,'/', { signature: '/', params: [] });

	testParse(t,'profile', { signature: '/profile', params: [] });

	testParse(t,'/profile', { signature: '/profile', params: [] });

	testParse(t,'profile/summary',
		{ signature: '/profile/summary', params: [] });

	testParse(t,'/profile/summary',
		{ signature: '/profile/summary', params: [] });

	testParse(t,'profile/summary/address/street',
		{ signature: '/profile/summary/address/street', params: [] });

	testParse(t,'/profile/summary/address/street',
		{ signature: '/profile/summary/address/street', params: [] });

	testParse(t,':pk',
		{ signature: '/:', params: ['pk'] });

	testParse(t,'/:pk',
		{ signature: '/:', params: ['pk'] });

	testParse(t,':country/:city',
		{ signature: '/:/:', params: ['country', 'city'] });

	testParse(t,'/:country/:city',
		{ signature: '/:/:', params: ['country', 'city'] });

	testParse(t,':country/:city/:street/:building',
		{ signature: '/:/:/:/:',
			params: ['country', 'city', 'street', 'building'] });

	testParse(t,'/:country/:city/:street/:building',
		{ signature: '/:/:/:/:',
			params: ['country', 'city', 'street', 'building'] });

	testParse(t,'products/:pk',
		{ signature: '/products/:', params: ['pk'] });

	testParse(t,'/products/:pk',
		{ signature: '/products/:', params: ['pk'] });

	testParse(t,'products/:country/:city',
		{ signature: '/products/:/:', params: ['country', 'city'] });

	testParse(t,'/products/:country/:city',
		{ signature: '/products/:/:', params: ['country', 'city'] });

	testParse(t,'api/products/:pk',
		{ signature: '/api/products/:', params: ['pk'] });

	testParse(t,'/api/products/:pk',
		{ signature: '/api/products/:', params: ['pk'] });

	testParse(t,'api/products/:country/:city',
		{ signature: '/api/products/:/:',
			params: ['country', 'city'] });

	testParse(t,'/api/products/:country/:city',
		{ signature: '/api/products/:/:',
			params: ['country', 'city'] });

	testParse(t,'/api/v1/products/:country/:city/:address',
		{ signature: '/api/v1/products/:/:/:',
			params: ['country', 'city', 'address'] });

	testParse(t,'/products/:pk/details/:country',
		{ signature: '/products/:/details/:',
			params: ['pk', 'country'] });

	testParseError(t, ':');
	testParseError(t, '/:');
	testParseError(t, '/profile/:');
	testParseError(t, '/profile/:/details');

	t.throws(function(){
		parse('/pro?file');
	}, /Unexpected token \"\?\"/);
});
