// require.js looks for the following global when initializing
var require = {
	shim:{
		'jquery.bootstrap' 		: 		{deps: ['jquery'] }

	},
	paths:{
		jquery				: 		"../libs/jquery",
		"jquery.bootstrap" 		: 		"../libs/bootstrap.min",
		"d3" 					: 		"../libs/d3.v3.min",
		"worldmap"				:		"../libs/worldmap"

	}
};