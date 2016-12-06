'use strict';

var test = require('tape');
var match = require('../lib/match-signature');

test('Exact', function( t ){
	t.deepEqual(match('/users', '/users?a=b'), {
		args: [],
		query: 'a=b',
	});

	t.deepEqual(match('/users', '/users?'), {
		args: [],
		query: '',
	});

	t.deepEqual(match('/users', '/users/'), false);
	t.deepEqual(match('/users', '/user'), false);
	t.deepEqual(match('/users', '/userss'), false);

	t.end();
});

test('Patterns', function( t ){
	t.deepEqual(match('/users/:', '/users/123'), {
		args: [ '123' ],
		query: '',
	});

	t.deepEqual(match('/users/:', '/users/1'), {
		args: [ '1' ],
		query: '',
	});

	t.deepEqual(match('/users/:', '/users/1?'), {
		args: [ '1' ],
		query: '',
	});

	t.deepEqual(match('/users/:', '/users/1?a=b'), {
		args: [ '1' ],
		query: 'a=b',
	});

	t.deepEqual(match('/users/:', '/users/:'), {
		args: [ ':' ],
		query: '',
	});

	t.deepEqual(match('/users/:', '/users/'), false);
	t.deepEqual(match('/users/:', '/users//'), false);
	t.deepEqual(match('/users/:', '/users/123/'), false);
	t.deepEqual(match('/users/:', '/users/?'), false);
	t.deepEqual(match('/users/:', '/users/?a'), false);
	t.deepEqual(match('/users/:', '/users//a'), false);


	t.deepEqual(match('/users/:/', '/users/123/'), {
		args: [ '123' ],
		query: '',
	});

	t.deepEqual(match('/users/:/', '/users/123'), false);
	t.deepEqual(match('/users/:/', '/users/123?'), false);
	t.deepEqual(match('/users/:/', '/users//'), false);


	t.deepEqual(match('/users/:/photos', '/users/123/photos'), {
		args: [ '123' ],
		query: '',
	});

	t.deepEqual(match('/users/:/photos', '/users/123/'), false);
	t.deepEqual(match('/users/:/photos', '/users/123/?'), false);
	t.deepEqual(match('/users/:/photos', '/users//photos'), false);
	t.deepEqual(match('/users/:/photos', '/users/photos'), false);
	t.deepEqual(match('/users/:/photos', '/users/1photos'), false);


	t.deepEqual(match('/users/:/photos/:', '/users/123/photos/456'), {
		args: [ '123', '456' ],
		query: '',
	});

	t.deepEqual(match('/users/:/photos/:', '/users/:/photos/:'), {
		args: [ ':', ':' ],
		query: '',
	});


	t.deepEqual(match('/users/:/:', '/users/a/b'), {
		args: [ 'a', 'b' ],
		query: '',
	});

	t.deepEqual(match('/users/:/:', '/users/a/b?'), {
		args: [ 'a', 'b' ],
		query: '',
	});

	t.deepEqual(match('/users/:/:', '/users/a/b?a=b'), {
		args: [ 'a', 'b' ],
		query: 'a=b',
	});

	t.deepEqual(match('/users/:/:', '/users/a/'), false);
	t.deepEqual(match('/users/:/:', '/users/a/?'), false);


	t.end();
});
