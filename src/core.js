Swapper._swapper = function (os, isNode, isInDOM, insertBefore, insertAfter, removeNode, setTransform, setTransition, getStyles, transitions, easings, validate, window, document) {
	var NO_TRANSFORM = 'translate3d(0,0,0) scale(1)';

	var isIOS5 = (os.ios && (Math.floor(os.version) === 5));

	function swapper (elem1, elem2, options, callback) {
		validate.element(elem1);
		validate.element(elem2);

		if (typeof options === 'function') {
			callback = options;
			options  = {};
		}

		options  = validate.options(options);
		callback = validate.callback(callback);

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
			computedStyles2 = getStyles(elem2),
			styles1         = getStyles(elem1, true),
			styles2         = getStyles(elem2, true);

		if (computedStyles1.display !== 'none') {
			if (isIOS5) {
				// this is a hack to fix iOS5 positioning when its low on memory
				// it may break layouts that dont take this into account
				elem2.style.position = 'absolute';
			}
			else {
				elem2.style.position = 'fixed';
			}
			elem2.style.top      = bounds.top  + 'px';
			elem2.style.left     = bounds.left + 'px';
		}
		elem2.style.height   = computedStyles2.height || computedStyles1.height;
		elem2.style.width    = computedStyles2.width  || computedStyles1.width;

		if ( transition[2] ) {
			insertBefore(elem2, elem1);
		}



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

				if ((computedStyles2.display !== 'none') && (transition[0].fade || (transition[0].transform && transition[0].transform !== NO_TRANSFORM))) {
					transitionElem = elem2;
					bindCleanup();
				}
				else if ((computedStyles1.display !== 'none') && (transition[1].fade || (transition[1].transform && transition[1].transform !== NO_TRANSFORM))) {
					transitionElem = elem1;
					bindCleanup();
				}
				else {
					setTimeout(cleanupElems, duration);
				}
			}, 0);
		}, 0);



		var cleanUpLock = false,
			transitionElem;

		function bindCleanup () {
			transitionElem.addEventListener('webkitTransitionEnd' , cleanupElems , false);
			transitionElem.addEventListener('transitionend'       , cleanupElems , false);
			transitionElem.addEventListener('oTransitionEnd'      , cleanupElems , false);
			transitionElem.addEventListener('otransitionend'      , cleanupElems , false);
			transitionElem.addEventListener('MSTransitionEnd'     , cleanupElems , false);
			transitionElem.addEventListener('transitionend'       , cleanupElems , false);
		}

		function unbindCleanup () {
			transitionElem.removeEventListener('webkitTransitionEnd' , cleanupElems);
			transitionElem.removeEventListener('transitionend'       , cleanupElems);
			transitionElem.removeEventListener('oTransitionEnd'      , cleanupElems);
			transitionElem.removeEventListener('otransitionend'      , cleanupElems);
			transitionElem.removeEventListener('MSTransitionEnd'     , cleanupElems);
			transitionElem.removeEventListener('transitionend'       , cleanupElems);
		}

		function beginCleanupCounter () {
			bindCleanup();
		}

		function cleanupElems () {
			if (cleanUpLock) {
				return;
			}
			cleanUpLock = true;

			if (transitionElem) {
				unbindCleanup();
			}

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



	return swapper;
}(
	Swapper._os            , // from utils.js
	Swapper._isNode        , // from utils.js
	Swapper._isInDOM       , // from utils.js
	Swapper._insertBefore  , // from utils.js
	Swapper._insertAfter   , // from utils.js
	Swapper._removeNode    , // from utils.js
	Swapper._setTransform  , // from utils.js
	Swapper._setTransition , // from utils.js
	Swapper._getStyles     , // from utils.js
	Swapper._transitions   , // from transitions.js
	Swapper._easings       , // from transitions.js
	Swapper._validate      , // from validators.js
	window                 ,
	document
);
