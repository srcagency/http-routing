# http routing

Simple, unobtrusive routing of HTTP requests (a url and a verb) for the server
or a browser.

Started as a research project in routing *without regular expressions*.

## example

```js
var router = require('http-routing');

// create a new index of routes
var routes = [
	router.route('GET', '/ping', 'A'),
	router.route('GET', '/echo/:word', 'B'),
];

router.match(routes, 'GET', '/anything');	// undefined
router.match(routes, 'POST', '/ping');	// undefined

router.match(routes, 'GET', '/ping');
/*
{
	method: 'GET',
	signature: '/ping',
	params: [],
	value: 'A',
	args: [],
	query: '',
}
*/

router.match(routes, 'GET', '/echo/bam?a=b');
/*
{
	method: 'GET',
	signature: '/echo/:',
	params: [ 'word' ],
	value: 'B',
	args: [ 'bam' ],
	query: 'a=b',
}
*/
```

## Install

```sh
 npm install http-routing
```

## Test

```sh
npm test
```
