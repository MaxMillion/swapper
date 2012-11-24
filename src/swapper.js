var Swapper = function (Zepto, jQuery) {
	// import Swapper._swapper from core.js



	// window.Swapper exports

	function Swapper (elem1, elem2, options, callback) {
		Swapper._swapper(elem1, elem2, options, callback);
	}



	// Zepto exports

	if (Zepto && Zepto.fn) {
		Zepto.extend(Zepto.fn, {
			swapper : function (elem2, options, callback) {
				elem2 = Zepto(elem2)[0];

				this.forEach(function (elem1) {
					Swapper._swapper(elem1, elem2, options, callback);
				});

				return this;
			}
		});
	}



	// jQuery exports

	if (jQuery && jQuery.fn) {
		jQuery.fn.swapper = function (elem2, options, callback) {
			elem2 = jQuery(elem2)[0];

			this.each(function () {
				Swapper._swapper(this, elem2, options, callback);
			});

			return this;
		};
	}



	return Swapper;
}(window.Zepto, window.jQuery);
