/******************************************************************************\
|                                                                              |
|                                   named-items.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This file defines a collection of named items.                        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseCollection from '../../collections/base-collection.js';

export default BaseCollection.extend({

	//
	// querying methods
	//

	getNames: function() {
		let names = [];
		for (let i = 0; i < this.length; i++) {
			names.push(this.at(i).get('name'));
		}
		return names;
	},

	getByName: function(name) {
		for (let i = 0; i < this.length; i++) {
			let model = this.at(i);
			if (model.get('name') === name) {
				return model;
			}
		}
	},

	//
	// filtering methods
	//

	removeDuplicateNames: function() {
		let namesFound = {};
		let removeList = [];

		// find list of items to remove
		//
		this.each(function(item) {
			if (namesFound[item.get('name')]) {
				removeList.push(item);
			} else {
				namesFound[item.get('name')] = true;
			}
		});

		this.remove(removeList);
	},

	distinguishRepeatedNames: function(namesCount) {
		if (!namesCount) {
			namesCount = {};
		}

		// append suffixes to repeated item names
		//
		this.each(function(item) {
			if (namesCount[item.get('name')]) {
				namesCount[item.get('name')]++;
				item.set('name', item.get('name') + ' (' + namesCount[item.get('name')] + ')');
			} else {
				namesCount[item.get('name')] = 1;
			}
		});
	},

	//
	// sorting methods
	//

	sort: function(options) {

		// sort by name, case insensitive
		//
		this.sortByAttribute('name', {
			comparator: function(name) {
				return name.toLowerCase();
			}
		});
	},

	sorted: function(options) {

		// sort by name, case insensitive
		//
		return this.sortedByAttribute('name', {
			comparator: function(name) {
				return name.toLowerCase();
			}		
		});
	}
});