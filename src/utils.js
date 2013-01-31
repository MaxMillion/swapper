Swapper._os = function (userAgent, parseFloat) {
	var name, version, match;

	if (match = /\bCPU.*OS (\d+(_\d+)?)/i.exec(userAgent)) {
		name    = 'ios';
		version = match[1].replace('_', '.');
	}
	else if (match = /\bAndroid (\d+(\.\d+)?)/.exec(userAgent)) {
		name    = 'android';
		version = match[1];
	}

	var data = {
		name    : name ,
		version : version && parseFloat(version)
	};

	data[ name ] = true;

	return data;
}(navigator.userAgent, parseFloat);



Swapper._isNode = function (Node, HTMLElement) {
	return function (elem) {
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
	};
}(Node, HTMLElement);



Swapper._isInDOM = function (isNode) {
	return function (elem, skipNodeCheck) {
		if (!skipNodeCheck && !isNode(elem)) {
			throw TypeError('element must be a DOM node, got ' + elem);
		}

		while (elem = elem.parentNode) {
			if (elem === document) {
				return true;
			}
		}

		return false;
	};
}(Swapper._isNode);



Swapper._insertBefore = function () {
	return function (newElem, targetElem) {
		targetElem.parentNode.insertBefore(newElem, targetElem);
	};
}();



Swapper._insertAfter = function () {
	return function (newElem, targetElem) {
		var parent = targetElem.parentNode;

		if (parent.lastchild === targetElem) {
			parent.appendChild(newElem);
		}
		else {
			parent.insertBefore(newElem, targetElem.nextSibling);
		}
	};
}();



Swapper._removeNode = function () {
	return function (elem) {
		if (elem.parentNode) {
			elem.parentNode.removeChild(elem);
		}
	};
}();



Swapper._setTransform = function () {
	return function (elem, transform) {
		elem.style['-webkit-transform'] = transform;
		elem.style[   '-moz-transform'] = transform;
		elem.style[    '-ms-transform'] = transform;
		elem.style[     '-o-transform'] = transform;
		elem.style[        'transform'] = transform;
	};
}();



Swapper._setTransition = function () {
	return function (elem, transition) {
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
	};
}();



Swapper._getStyles = function (document) {
	return function (elem, notComputed) {
		var styles;

		if (notComputed) {
			styles = elem.style;
		}
		else {
			styles = document.defaultView.getComputedStyle(elem, null);
		}

		return {
			'-webkit-transition' : styles['-webkit-transition'] ,
			   '-moz-transition' : styles[   '-moz-transition'] ,
			    '-ms-transition' : styles[    '-ms-transition'] ,
			     '-o-transition' : styles[     '-o-transition'] ,
			        'transition' : styles[        'transition'] ,
			display  : styles.display  ,
			opacity  : styles.opacity  ,
			top      : styles.top      ,
			left     : styles.left     ,
			height   : styles.height   ,
			width    : styles.width    ,
			position : styles.position
		};
	};
}(document);
