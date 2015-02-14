Swapper._easings = {
	'linear'      : 'linear'      ,
	'ease'        : 'ease'        ,
	'ease-in'     : 'ease-in'     ,
	'ease-out'    : 'ease-out'    ,
	'ease-in-out' : 'ease-in-out' ,
	'step-start'  : 'step-start'  ,
	'step-end'    : 'step-end'
};



Swapper._transitions = {
	'fade' : [
		{ fade : true },
		{ fade : true }
	],
	'fade-on' : [
		{ fade : true },
		{}
	],
	'fade-off' : [
		{},
		{ fade : true },
		true
	],
	'scale-in' : [
		{ transform : 'scale(0.01)' },
		{}
	],
	'scale-out' : [
		{},
		{ transform : 'scale(0.01)' },
		true
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
		{}
	],
	'explode-out' : [
		{},
		{ fade : true , transform : 'scale(1.25)' },
		true
	],
	'implode-in' : [
		{},
		{ fade : true , transform : 'scale(0.60)' },
		true
	],
	'implode-out' : [
		{ fade : true , transform : 'scale(0.80)' },
		{}
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
	],
	'slideon-left' : [
		{ transform : 'translate3d(-100%,0,0)' },
		{}
	],
	'slideoff-left' : [
		{},
		{ transform : 'translate3d(-100%,0,0)' },
		true
	],
	'slideon-right' : [
		{ transform : 'translate3d(100%,0,0)' },
		{}
	],
	'slideoff-right' : [
		{},
		{ transform : 'translate3d(100%,0,0)' },
		true
	],
	'slideon-up' : [
		{ transform : 'translate3d(0,-100%,0)' },
		{}
	],
	'slideoff-up' : [
		{},
		{ transform : 'translate3d(0,-100%,0)' },
		true
	],
	'slideon-down' : [
		{ transform : 'translate3d(0,100%,0)' },
		{}
	],
	'slideoff-down' : [
		{},
		{ transform : 'translate3d(0,100%,0)' },
		true
	],
	'slideon-left-ios' : [
		{ transform : 'translate3d(100%,0,0)' },
		{ transform : 'translate3d(-30%,0,0)' }
	],
	'slideoff-right-ios' : [
		{ transform : 'translate3d(-30%,0,0)' },
		{ transform : 'translate3d(100%,0,0)' },
		true
	],
	'glideon-right' : [
		{ transform : 'translate3d(110%,0,0)' },
		{ transform : 'translate3d(-20%,0,0)' }
	],
	'glideoff-right' : [
		{ transform : 'translate3d(-20%,0,0)' },
		{ transform : 'translate3d(110%,0,0)' },
		true
	],
	'glideon-left' : [
		{ transform : 'translate3d(-110%,0,0)' },
		{ transform : 'translate3d(20%,0,0)'   }
	],
	'glideoff-left' : [
		{ transform : 'translate3d(20%,0,0)'   },
		{ transform : 'translate3d(-110%,0,0)' },
		true
	],
	'glideon-down' : [
		{ transform : 'translate3d(0,110%,0)' },
		{ transform : 'translate3d(0,-20%,0)' }
	],
	'glideoff-down' : [
		{ transform : 'translate3d(0,-20%,0)' },
		{ transform : 'translate3d(0,110%,0)' },
		true
	],
	'glideon-up' : [
		{ transform : 'translate3d(0,-110%,0)' },
		{ transform : 'translate3d(0,20%,0)' }
	],
	'glideoff-up' : [
		{ transform : 'translate3d(0,20%,0)' },
		{ transform : 'translate3d(0,-110%,0)' },
		true
	],
	'android-l-in' : [
		{ transform : 'translate3d(0,9%,0)', fade : true },
		{}
	],
	'android-l-out' : [
		{},
		{ transform : 'translate3d(0,9%,0)', fade : true },
		true
	]
};
