/*
Town Game

Incremental game that runs in the background during
the travel/battle games.

*/

var TownController = {
	// internal data model
	state: {
		story: {/* miscellaneous, i.e. counters */},
		treasury: {},
		roster: {},
		buildings: {},
	},

	// shared template data for town game functionality
	templates: {},

	// controller interface
	loadSave: function(saveData) {},
	makeSave: function() {},
	addBuilding: function(buildingData) {},
	removeBuilding: function(buildingId) {},
	addResource: function(resData) {},
	removeResource: function(resId) {},
	addHero: function(heroData) {},
	removeHero: function(heroId) {},

	// model manipulation

	// DOM manipulation

};

// shorthand
var $T = TownController;
