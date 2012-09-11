/**
 * swapper.js v1.0
 * UI navigation and transition utility
 * Copyright (c) 2012 Kik Interactive, http://kik.com
 * Released under the MIT license
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

var Swapper = function (window, document, Zepto, jQuery) {
	var NO_TRANSFORM = 'translate3d(0,0,0)';

	var transitions = {
			'fade' : [
				{ fade : true },
				{ fade : true }
			],
			'scale-in' : [
				{ transform : 'scale(0.01)' },
				{ fade      : true          }
			],
			'scale-out' : [
				{ fade      : true          },
				{ transform : 'scale(0.01)' }
			],
			'rotate-left' : [
				{ transform : 'rotateY(-180deg) perspective(360px)' , fade : true },
				{ transform : 'rotateY( 180deg) perspective(360px)' , fade : true }
			],
			'rotate-right' : [
				{ transform : 'rotateY( 180deg) perspective(360px)' , fade : true },
				{ transform : 'rotateY(-180deg) perspective(360px)' , fade : true }
			],
			'cube-left' : [
				{ transform : 'translate3d( 50%,0,0) rotateY(-90deg) perspective(360px)' },
				{ transform : 'translate3d(-50%,0,0) rotateY( 90deg) perspective(360px)' }
			],
			'cube-right' : [
				{ transform : 'translate3d(-50%,0,0) rotateY( 90deg) perspective(360px)' },
				{ transform : 'translate3d( 50%,0,0) rotateY(-90deg) perspective(360px)' }
			],
			'swap-left' : [
				{ transform : 'translate3d( 65%,0,0) rotateY( 90deg) perspective(360px)' },
				{ transform : 'translate3d(-65%,0,0) rotateY(-90deg) perspective(360px)' }
			],
			'swap-right' : [
				{ transform : 'translate3d(-65%,0,0) rotateY(-90deg) perspective(360px)' },
				{ transform : 'translate3d( 65%,0,0) rotateY( 90deg) perspective(360px)' }
			],
			'explode-in' : [
				{ fade : true , transform : 'scale(1.25)' },
				{ fade : true }
			],
			'explode-out' : [
				{ fade : true },
				{ fade : true , transform : 'scale(1.25)' }
			],
			'slide-left' : [
				{ transform : 'translate3d( 100%,0,0)' },
				{ transform : 'translate3d(-100%,0,0)' }
			],
			'slide-right' : [
				{ transform : 'translate3d(-100%,0,0)' },
				{ transform : 'translate3d( 100%,0,0)' }
			],
			'slide-up' : [
				{ transform : 'translate3d(0, 100%,0)' },
				{ transform : 'translate3d(0,-100%,0)' }
			],
			'slide-down' : [
				{ transform : 'translate3d(0,-100%,0)' },
				{ transform : 'translate3d(0, 100%,0)' }
			]
		},
		easings     = {
			'linear'      : 'linear'      ,
			'ease'        : 'ease'        ,
			'ease-in'     : 'ease-in'     ,
			'ease-out'    : 'ease-out'    ,
			'ease-in-out' : 'ease-in-out' ,
			'step-start'  : 'step-start'  ,
			'step-end'    : 'step-end'
		};



	function isNode (elem) {
		if ( !elem ) {
			return false;
		}

		try {
			return (elem instanceof Node) || (elem instanceof HTMLElement);
		} catch (err) {}

		if (typeof elem !== 'object') {
			return false;
		}

		if (typeof elem.nodeType !== 'number') {
			return false;
		}

		if (typeof elem.nodeName !== 'string') {
			return false;
		}

		return true;
	}

	function isInDOM (elem, skipNodeCheck) {
		if (!skipNodeCheck && !isNode(elem)) {
			throw TypeError('element must be a DOM node, got ' + elem);
		}

		while (elem = elem.parentNode) {
			if (elem === document) {
				return true;
			}
		}

		return false;
	}

	function insertAfter (newElem, targetElem) {
		var parent = targetElem.parentNode;

		if (parent.lastchild === targetElem) {
			parent.appendChild(newElem);
		}
		else {
			parent.insertBefore(newElem, targetElem.nextSibling);
		}
	}

	function removeNode (elem) {
		if (elem.parentNode) {
			elem.parentNode.removeChild(elem);
		}
	}

	function setTransform (elem, transform) {
		elem.style['-webkit-transform'] = transform;
		elem.style[   '-moz-transform'] = transform;
		elem.style[    '-ms-transform'] = transform;
		elem.style[     '-o-transform'] = transform;
		elem.style[        'transform'] = transform;
	}

	function setTransition (elem, transition) {
		if (transition) {
			elem.style['-webkit-transition'] = '-webkit-'+transition;
			elem.style[   '-moz-transition'] =    '-moz-'+transition;
			elem.style[    '-ms-transition'] =     '-ms-'+transition;
			elem.style[     '-o-transition'] =      '-o-'+transition;
			elem.style[        'transition'] =            transition;
		}
		else {
			elem.style['-webkit-transition'] = '';
			elem.style[   '-moz-transition'] = '';
			elem.style[    '-ms-transition'] = '';
			elem.style[     '-o-transition'] = '';
			elem.style[        'transition'] = '';
		}
	}

	function getStyles (elem, notComputed) {
		var styles;

		if (notComputed) {
			styles = elem.style;
		}
		else {
			styles = document.defaultView.getComputedStyle(elem, null);
		}

		return {
			opacity  : styles.opacity  ,
			top      : styles.top      ,
			left     : styles.left     ,
			height   : styles.height   ,
			width    : styles.width    ,
			position : styles.position
		};
	}



	function validateElement (elem) {
		if ( !isNode(elem) ) {
			throw TypeError('element must be a DOM node, got ' + elem);
		}
	}

	function validateOptions (options) {
		switch (typeof options) {
			case 'string':
				options = { transition: options };
				break;

			case 'undefined':
				options = {};
				break;

			case 'object':
				break;

			default:
				throw TypeError('options must be an object if defined, got ' + options);
		}

		switch (typeof options.transition) {
			case 'string':
				if (!(options.transition in transitions) && (options.transition !== 'instant')) {
					throw TypeError(options.transition + ' is not a valid transition');
				}
				break;

			case 'undefined':
				break;

			default:
				throw TypeError('transition must be a string if defined, got ' + options.transition);
		}

		switch (typeof options.duration) {
			case 'number':
				if (options.duration < 0) {
					throw TypeError('duration must be a non-negative integer, got ' + options.duration);
				}
				break;

			case 'undefined':
				break;

			default:
				throw TypeError('duration must be a number if defined, got ' + options.duration);
		}

		switch (typeof options.easing) {
			case 'string':
				if ( !(options.easing in easings) ) {
					throw TypeError(options.easing + ' is not a valid easing');
				}
				break;

			case 'undefined':
				break;

			default:
				throw TypeError('easing must be a string if defined, got ' + options.easing);
		}

		return options;
	}

	function validateCallback (callback) {
		switch (typeof callback) {
			case 'undefined':
				callback = function () {};
				// fall through

			case 'function':
				break;

			default:
				throw TypeError('callback must be a function if defined, got ' + callback);
		}

		return callback;
	}



	function swapper (elem1, elem2, options, callback) {
		validateElement(elem1);
		validateElement(elem2);

		if (typeof options === 'function') {
			callback = options;
			options  = {};
		}

		options  = validateOptions(options);
		callback = validateCallback(callback);

		if (elem1._swapper) {
			throw Error('elem1 is currently being swapped');
		}

		if (elem2._swapper) {
			throw Error('elem2 is currently being swapped');
		}

		if ( !isInDOM(elem1, true) ) {
			throw Error('elem1 must be in the DOM to be swapped');
		}

		elem1._swapper = true;
		elem2._swapper = true;

		removeNode(elem2);



		if (options.transition === 'instant') {
			insertAfter(elem2, elem1);
			removeNode(elem1);
			elem1._swapper = false;
			elem2._swapper = false;
			setTimeout(function () {
				callback();
			}, 0);
			return;
		}



		var transition = transitions[options.transition || 'fade'],
			easing     = easings[options.easing || 'ease-in-out'],
			duration   = options.duration || 300;

		insertAfter(elem2, elem1);

		var bounds          = elem1.getBoundingClientRect(),
			computedStyles1 = getStyles(elem1),
			styles1         = getStyles(elem1, true),
			styles2         = getStyles(elem2, true);

		elem2.style.position = 'fixed';
		elem2.style.top      = bounds.top  + 'px';
		elem2.style.left     = bounds.left + 'px';
		elem2.style.height   = computedStyles1.height;
		elem2.style.width    = computedStyles1.width;



		setTransform(elem1, NO_TRANSFORM );
		setTransform(elem2, transition[0].transform || NO_TRANSFORM);

		if ( transition[0].fade ) {
			elem2.style.opacity = '0';
		}

		if ( transition[1].fade ) {
			elem1.style.opacity = '1';
		}

		setTimeout(function () {
			var cssTransition = 'transform '+(duration/1000)+'s '+easing+', opacity '+(duration/1000)+'s '+easing;
			setTransition(elem1, cssTransition);
			setTransition(elem2, cssTransition);

			setTimeout(function () {
				setTransform(elem1, transition[1].transform || NO_TRANSFORM);
				setTransform(elem2, NO_TRANSFORM );

				if ( transition[0].fade ) {
					elem2.style.opacity = '1';
				}

				if ( transition[1].fade ) {
					elem1.style.opacity = '0';
				}

				setTimeout(cleanupElems, duration)
			}, 0);
		}, 0);



		function cleanupElems () {
			removeNode(elem1);

			setTransition(elem1, '');
			setTransition(elem2, '');

			setTimeout(function () {
				setTransform(elem1, '');
				setTransform(elem2, '');

				if ( transition[0].fade ) {
					elem2.style.opacity = styles2.opacity;
				}

				if ( transition[1].fade ) {
					elem1.style.opacity = styles1.opacity;
				}

				elem2.style.position = styles2.position;
				elem2.style.top      = styles2.top;
				elem2.style.left     = styles2.left;
				elem2.style.height   = styles2.height;
				elem2.style.width    = styles2.width;

				elem1._swapper = false;
				elem2._swapper = false;

				callback();
			}, 0);
		}
	}



	if (Zepto) {
		Zepto.extend(Zepto.fn, {
			swapper : function (elem2, options, callback) {
				elem2 = Zepto(elem2)[0];

				this.forEach(function (elem1) {
					swapper(elem1, elem2, options, callback);
				});

				return this;
			}
		});
	}

	if (jQuery) {
		jQuery.fn.swapper = function (elem2, options, callback) {
			elem2 = jQuery(elem2)[0];

			this.each(function () {
				swapper(this, elem2, options, callback);
			});

			return this;
		};
	}



	return swapper;
}(window, document, window.Zepto, window.jQuery);
