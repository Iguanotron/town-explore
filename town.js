/*
Town Game

Incremental game that runs in the background during
the travel/battle games.

*/

var TownController = {
	// active timer
	timer: null,

	// internal data model
	state: {
		time: 0,
		story: {/* miscellaneous state data, i.e. counters */},
		treasury: {},
		roster: {},
		buildings: {},
	},

	// shared template data for town game functionality
	templates: {
		resources: {
			gold: {
				name: "Gold",
			},
		},
		activities: {
			idle: {
				name: "Idle",
			},
			research: {
				name: "Research",
				reward: function () {},
			},
		},
		buildings: {
			library: {
				name: "Library",
				tooltip: "Allows research",
				upgrades: {
					librarian: {
						cost: {
							gold: 100
						},
						action: function () {},
					},
				},
			},
		},
		classes: {
			archer: {
				name: "Archer",
			},
		},
	},

	// controller interface
	start: function (saveData/*(optional?)*/) {},
	pause: function () {},
	tick: function () {},
	loadSave: function (saveData) {
		// TODO validate saveData
		for (resId in saveData.treasury) {
			$T.addResource(resId, saveData.treasury[resId].qty);
			$T.addResYield(resId, saveData.treasury[resId].yield);
		}
		for (buildingId in saveData.buildings) {
			// TODO
		}
		for (heroId in saveData.roster) {
			$T.addHero(saveData.roster[heroId]);
		}
	},
	makeSave: function () {},
	addBuilding: function (buildingData) {},
	removeBuilding: function (buildingName) {},
	addResource: function (resId, qty) {
		// returns true on success, false on failure
		var resData = $T.state.treasury[resId];
		if (resData) {
			if (qty >= 0) {
				resData.qty += qty;
				$T.updateListener('res', resId, 'qty', resData.qty);
				return true;
			} else if (resData.qty + qty === 0) {
				// Exactly out of the resource; remove it from the list
				// if it is not being actively incremented
				if (!resData.yield) {
					delete $T.state.treasury[resId];
					$(`town-treasury-res-${resId}`).remove();
				} else {
					resData.qty = 0;
					$T.updateListener('res', resId, 'qty', 0);
				}
				return true;
			} else if (resData.qty + qty > 0) {
				resData.qty += qty;
				$T.updateListener('res', resId, 'qty', resData.qty);
				return true;
			} else {
				return false; // not enough available to spend
			}
		} else if (qty >= 0) {
			$T.state.treasury[resId] = {
				qty: qty,
				yield: {},
			};
			$T.makeTreasuryEntry(resId, qty);
			return true;
		} else {
			return false; // cannot spend; does not exist
		}
	},
	res: function (resName) {
		var resData = $T.state.treasury[resName];
		if (resData) {
			return resData.qty;
		} else { /* resource not known */
			return 0;
		}
	},
	addHero: function (heroData) {
		if ($T.state.roster[heroData.id]) {
			throw `Duplicate hero added to roster: ${heroData.id}`;
		} else {
			$T.state.roster[heroData.id] = heroData;
			$T.makeHeroRosterEntry(heroData);
		}
	},
	removeHero: function (heroId) {
		delete $T.state.roster[heroData.id];
		$(`town-roster-hero-${heroId}`).remove();
	},

	// model manipulation
	addResYield: function (resId, yieldExtension) {
		var resYield = $T.state.treasury[resId].yield;
		for (resId in yieldExtension) {
			if (resYield[resId]) {
				resYeild[resId] += yieldExtension[resId];
			} else {
				resYield[resId] = yieldExtension[resId];
			}
		}
	},

	// template processing
	resDisplayName: function (resId) {
		return $T.templates.resources[resId].name;
	},
	classDisplayName: function (classId) {
		return $T.templates.classes[classId].name;
	},
	activityDisplayName: function (activityId) {
		return $T.templates.activities[activityId].name;
	},


	// DOM manipulation
	makeListener: function (type, id, field, value) {
		return $('<div>')
			.addClass('listener')
			.attr('id', `listening-town-${type}-${id}-${field}`)
			.text(value);
	},
	updateListener: function (type, id, field, value) {
		// example listener id's:
		// listening-town-res-gold-qty
		// listening-town-hero-7-activity
		$(`#listening-town-${type}-${id}-${field}`).text(value);
	},
	makeHeroRosterEntry: function (heroData) {
		var newEntry = $('<div>')
			.addClass('roster-entry')
			.addClass('list-entry')
			.attr('id', `town-roster-hero-${heroData.heroId}`);

		$T.makeListener('hero', heroData.heroId, 'name', heroData.name)
			.addClass('hero-name')
			.addClass('list-label')
			.appendTo(newEntry);
		$T.makeListener('hero', heroData.heroId, 'class', $T.classDisplayName(heroData.class))
			.addClass('hero-class')
			.addClass('list-value')
			.appendTo(newEntry);
		$T.makeListener('hero', heroData.heroId, 'activity', $T.activityDisplayName(heroData.activity))
			.addClass('hero-activity')
			.addClass('list-value')
			.appendTo(newEntry);

		$('#town-roster').append(newEntry);
		return newEntry;
	},
	makeTreasuryEntry: function (resId, qty) {
		var newEntry = $('<div>')
			.addClass('treasury-entry')
			.addClass('list-entry')
			.attr('id', `town-treasury-res-${resId}`);

		$T.makeListener('res', resId, 'name', $T.resDisplayName(resId))
			.addClass('res-name')
			.addClass('list-label')
			.appendTo(newEntry);
		$T.makeListener('res', resId, 'qty', qty)
			.addClass('res-qty')
			.addClass('list-value')
			.appendTo(newEntry);

		$('#town-treasury').append(newEntry);
		return newEntry;
	},

};

// shorthand
var $T = TownController;


//////////////////////////////
// Temporary test save data //
//////////////////////////////

var testSave = {
	time: 50,
	story: {},
	treasury: {
		gold: {
			qty: 100,
			yield: 1,
		},
	},
	roster: {
		0: {
			activity: 'idle',
			heroId: 0,
			name: "Bob",
			class: 'archer',
			inventory: {},
		},
	},
	buildings: {
		library: {
			upgrades: {
				librarian: false,
			},
			activities: {
				research: false,
			},
			yield: {
				gold: 1,
			},
		},
	},
};

$(document).ready(function () {
	$T.loadSave(testSave);
});
