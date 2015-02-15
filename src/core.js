Swapper._swapper = function (os, isNode, isInDOM, insertBefore, insertAfter, removeNode, setTransform, setTransition, getStyles, transitions, easings, validate, window, document) {
	var NO_TRANSFORM       = 'translate3d(0,0,0) scale(1)',
		DEFAULT_TRANSITION = 'fade',
		DEFAULT_EASING     = 'ease-in-out';

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
		else if (elem2._swapper) {
			throw Error('elem2 is currently being swapped');
		}

		if ( !isInDOM(elem1, true) ) {
			throw Error('elem1 must be in the DOM to be swapped');
		}

		elem1._swapper = true;
		elem2._swapper = true;

		removeNode(elem2);

		performSwap(elem1, elem2, options, function () {
			elem1._swapper = false;
			elem2._swapper = false;
			callback();
		});
	}



	function performSwap (elem1, elem2, options, callback) {
		if (options.transition === 'instant') {
			insertAfter(elem2, elem1);
			removeNode(elem1);
			callback();
			return;
		}


		var transition = transitions[options.transition || DEFAULT_TRANSITION],
			easing     = options.easing || DEFAULT_EASING,
			duration   = options.duration || 300;

		if (easing.substr(0,13) !== 'cubic-bezier(') {
			easing = easings[easing];
		}

		// do this first to get accurate style readings
		insertAfter(elem2, elem1);

		var computedStyles1 = getStyles(elem1),
			computedStyles2 = getStyles(elem2),
			styles1         = getStyles(elem1, true),
			styles2         = getStyles(elem2, true);

		setInitialPosition(elem1, elem2, computedStyles1, computedStyles2);

		if ( transition[2] ) {
			insertBefore(elem2, elem1);
		}

		elem2.style.opacity = '0';
		setInitialTransitions(elem1, elem2);

		setTimeout(function () {
			elem2.style.opacity = computedStyles2.opacity;
			setInitialTransforms(elem1, elem2, transition);

			setTimeout(function () {
				setSwapperTransitions(elem1, elem2, duration, easing);

				setTimeout(function () {
					setFinalTransforms(elem1, elem2, transition);

					onTransitionEnd(elem1          , elem2          ,
									computedStyles1, computedStyles2,
									transition     , duration       ,
						function () {
							removeNode(elem1);

							removeSwapperTransitions(elem1, elem2, duration, easing);

							setTimeout(function () {
								restoreTransforms(elem1, elem2, styles1, styles2, transition);
								restorePosition(elem1, elem2, styles1, styles2);

								setTimeout(function () {
									restoreTransitions(elem1, elem2, styles1, styles2);

									callback();
								}, 0);
							}, 0);
						}
					);
				}, 0);
			}, 50);
		}, 0);
	}



	function setInitialPosition (elem1, elem2, styles1, styles2) {
		var bounds = elem1.getBoundingClientRect();

		if (styles1.display !== 'none') {
			if (isIOS5) {
				// this is a hack to fix iOS5 positioning when its low on memory
				// it may break layouts that dont take this into account
				elem2.style.position = 'absolute';
			}
			else {
				elem2.style.position = 'fixed';
			}
			elem2.style.top  = bounds.top  + 'px';
			elem2.style.left = bounds.left + 'px';
		}

		elem2.style.height = styles2.height || styles1.height;
		elem2.style.width  = styles2.width  || styles1.width ;
	}

	function restorePosition (elem1, elem2, styles1, styles2) {
		elem2.style.position = styles2.position;
		elem2.style.top      = styles2.top;
		elem2.style.left     = styles2.left;
		elem2.style.height   = styles2.height;
		elem2.style.width    = styles2.width;
	}



	function setInitialTransforms (elem1, elem2, transition) {
		setTransform(elem1, NO_TRANSFORM);
		setTransform(elem2, transition[0].transform || NO_TRANSFORM);

		if ( transition[0].fade ) {
			elem2.style.opacity = '0';
		}
		if ( transition[1].fade ) {
			elem1.style.opacity = '1';
		}
	}

	function setFinalTransforms (elem1, elem2, transition) {
		setTransform(elem1, transition[1].transform || NO_TRANSFORM);
		setTransform(elem2, NO_TRANSFORM);

		if ( transition[0].fade ) {
			elem2.style.opacity = '1';
		}
		if ( transition[1].fade ) {
			elem1.style.opacity = '0';
		}
	}

	function restoreTransforms (elem1, elem2, styles1, styles2, transition) {
		setTransform(elem1, '');
		setTransform(elem2, '');

		if ( transition[0].fade ) {
			elem2.style.opacity = styles2.opacity;
		}

		if ( transition[1].fade ) {
			elem1.style.opacity = styles1.opacity;
		}
	}



	function setSwapperTransitions (elem1, elem2, duration, easing) {
		var cssTransition = 'transform ' + (duration/1000) + 's ' + easing + ','
							+ 'opacity ' + (duration/1000) + 's ' + easing;
		setTransition(elem1, cssTransition);
		setTransition(elem2, cssTransition);
	}

	function removeSwapperTransitions (elem1, elem2, duration, easing) {
		setTransition(elem1, '');
		setTransition(elem2, '');
	}



	function setInitialTransitions (elem1, elem2) {
		setTransition(elem1, '');
		setTransition(elem2, '');
	}

	function restoreTransitions (elem1, elem2, styles1, styles2) {
		elem1.style['-webkit-transition'] = styles1['-webkit-transition'];
		elem1.style[   '-moz-transition'] = styles1[   '-moz-transition'];
		elem1.style[    '-ms-transition'] = styles1[    '-ms-transition'];
		elem1.style[     '-o-transition'] = styles1[     '-o-transition'];
		elem1.style[        'transition'] = styles1[        'transition'];
		elem2.style['-webkit-transition'] = styles2['-webkit-transition'];
		elem2.style[   '-moz-transition'] = styles2[   '-moz-transition'];
		elem2.style[    '-ms-transition'] = styles2[    '-ms-transition'];
		elem2.style[     '-o-transition'] = styles2[     '-o-transition'];
		elem2.style[        'transition'] = styles2[        'transition'];
	}



	function willFireTransitionEnd (styles, transition) {
		if (styles.display === 'none') {
			return false;
		}

		if (transition.fade) {
			return true;
		}

		if ( !transition.transform ) {
			return false;
		}
		else if (transition.transform === NO_TRANSFORM) {
			return false;
		}
		else {
			return true;
		}
	}

	function onTransitionEnd (elem1, elem2, styles1, styles2,
								transition, duration, callback) {
		var transitionElem;

		if ( willFireTransitionEnd(styles2, transition[0]) ) {
			transitionElem = elem2;
			bindCleanup();
		}
		else if ( willFireTransitionEnd(styles1, transition[1]) ) {
			transitionElem = elem1;
			bindCleanup();
		}
		else {
			setTimeout(finish, duration);
		}


		function bindCleanup () {
			transitionElem.addEventListener('webkitTransitionEnd' , finish , false);
			transitionElem.addEventListener('transitionend'       , finish , false);
			transitionElem.addEventListener('oTransitionEnd'      , finish , false);
			transitionElem.addEventListener('otransitionend'      , finish , false);
			transitionElem.addEventListener('MSTransitionEnd'     , finish , false);
			transitionElem.addEventListener('transitionend'       , finish , false);
		}

		function unbindCleanup () {
			transitionElem.removeEventListener('webkitTransitionEnd' , finish);
			transitionElem.removeEventListener('transitionend'       , finish);
			transitionElem.removeEventListener('oTransitionEnd'      , finish);
			transitionElem.removeEventListener('otransitionend'      , finish);
			transitionElem.removeEventListener('MSTransitionEnd'     , finish);
			transitionElem.removeEventListener('transitionend'       , finish);
		}


		var locked = false;

		function finish (e) {
			if (locked || !e || !e.target || (e.target !== transitionElem)) {
				return;
			}
			locked = true;

			if (transitionElem) {
				unbindCleanup();
			}

			callback();
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
