# http routing

Simple, unobtrusive routing of HTTP requests (a url and a verb) for
server or browser

Started as a research project in routing *without regular expressions*

## example

```js
var Router = require('http-routing');

var router = new Router();

router
	.catchAll(function(){
		// this = ctx
		// do 404
	})
	.get('/ping', function(){
		// do stuff
	})
	.get('/people/:city/:name', function( city, name ){
		console.log(city, name);	// what ever the user entered
	});

// match and run function with context
router.run('/ping', 'GET', ctx);

// match and return information
router.match('/ping', 'GET');
/*
{
	router	// route instance
	url		// url (/ping)
	verb	// verb (GET)
	idx		// index of matched route (0)
	next	// function to resume matching from this index
	route	// route instance
	params	// any params
}
*/
```
