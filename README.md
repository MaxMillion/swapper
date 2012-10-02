swapper.js - UI navigation and transition utility
==================================================

Navigating between view has been simplified. Simply tell Swapper which node is in the DOM and what to swap it with and away you go.

Swapper has tons of transition types (fading, sliding, scaling, rotating, cube transforms, Android-style, iPhone-style, etc).

swapper.js also provides convenient bindings for ZeptoJS and jQuery to make the development process as seamless as possible.


Links
-----

[Download script (v1.0 minified)](http://code.kik.com/swapper/1.0.min.js)

[View demo](http://code.kik.com/swapper/demos/basic.html)


Usage with ZeptoJS or jQuery
----------------------------

### Make elements clickable

```js
// elem1 is jQuery/Zepto element in DOM
// elem2 is jQuery/Zepto element not in DOM yet
elem1.swapper(elem2);
```


### Transition types

```js
elem1.swapper(elem2, 'slide-left');
```

Valid transitions are:
* fade
* scale-in
* scale-out
* rotate-left
* rotate-right
* cube-left
* cube-right
* swap-left
* swap-right
* explode-in
* explode-out
* slide-left
* slide-right
* slide-up
* slide-down


### Easing, transition durations

```js
elem1.swapper(elem2, {
	transition : 'slide-left'  ,
	duration   : 300           , // in milliseconds
	easing     : 'ease-in-out'
});
```

Valid easings are:
* linear
* ease
* ease-in
* ease-out
* ease-in-out
* step-start
* step-end


### Callbacks

Callbacks will be called when transitions are complete.

```js
elem1.swapper(elem2, 'slide-left', function () {
	console.log('done!');
});
```




Standalone Usage
----------------

swapper.js has no external dependencies and will work perfectly fine as a standalone library.

```js
// elem1 is an element in DOM
// elem2 is an element not in DOM yet

Swapper(elem1, elem2);

Swapper(elem1, elem2, 'slide-left');

Swapper(elem1, elem2, {
	transition : 'slide-left'  ,
	duration   : 300           ,
	easing     : 'ease-in-out'
});

Swapper(elem1, elem2, 'slide-left', function () {
	console.log('done!');
});
```
