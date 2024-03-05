/******************************************************************************\
|                                                                              |
|                                    units.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is a class for helping with unit conversions.                    |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2022, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

//
// constructor
//

function Units(value, units) {

	// set attributes 
	//
	if (units.indexOf('/') != -1) {

		// rate (ratio) units
		//
		let terms = units.split('/');
		this.numerator = new Units(value, terms[0]);
		this.denominator = new Units(1, terms[1]);
	} else {

		// simple units
		//
		this.value = value;
		this.units = units;
		this.targetUnits = units;			
	}

	return this;
}

_.extend(Units.prototype, {

	//
	// querying methods
	//

	as: function(units) {
		return this.clone().to(units);
	},

	to: function(units) {
		if (units.indexOf('/') != -1) {
			// rate (ratio) units
			//
			let terms = units.split('/');
			this.numerator.to(terms[0]);
			this.denominator.to(terms[1]);
		} else {
			// simple units
			//
			this.targetUnits = units;
		}
		return this;
	},

	baseUnits: function() {
		if (this.units.indexOf('^') != -1) {
			let terms = this.units.split('^');
			return terms[0];
		} else {
			return this.units;
		}
	},

	val: function() {
		if (this.numerator) {
			
			// compute rate value
			//
			return this.numerator.val() / this.denominator.val();
		} else if (this.value != undefined && this.value !== '' && !isNaN(this.value)) {
			let terms;
			let baseUnits, basePower;
			let targetBaseUnits, targetPower;
			// parse power for current units
			//
			if (this.units.indexOf('^') != -1) {
				terms = this.units.split('^');
				baseUnits = terms[0];
				basePower = terms[1];
			} else {
				baseUnits = this.units;
				basePower = 1;
			}
			// parse power for target units
			//
			if (this.targetUnits.indexOf('^') != -1) {
				terms = this.targetUnits.split('^');
				targetBaseUnits = terms[0];
				targetPower = terms[1];
			} else {
				targetBaseUnits = this.targetUnits;
				targetPower = 1;
			}
			// can not convert from units of different powers
			//
			if (basePower != targetPower) {
				throw new Error('Incompatible powers; cannot convert from "' + this.units + '" to "' + this.targetUnits + '"');			
			}
			
			// first, convert from the current value to the base unit
			//
			let current = Units.table[baseUnits];
			let target = Units.table[targetBaseUnits];
			if (target.base != current.base) {
				throw new Error('Incompatible units; cannot convert from "' + this.units + '" to "' + this.targetUnits + '"');
			}
			// compute conversion
			//
			if (!basePower || basePower == 1) {
				return this.value * (current.multiplier / target.multiplier);
			} else {
				return this.value * (current.multiplier / target.multiplier) ** basePower;
			}
		}
	},

	clone: function() {
		if (this.numerator) {
			let units = new Units(undefined, '/');
			units.numerator = this.numerator.clone();
			units.denominator = this.denominator.clone();
			return units;	
		} else {
			return new Units(this.value, this.units);
		}
	},

	//
	// rate computing methods
	//

	num: function() {
		return this.numerator.value / this.denominator.value;
	},
	
	rate: function() {
		return this.numerator.units + '/' + this.denominator.units;
	},

	targetRate: function() {
		return this.numerator.targetUnits + '/' + this.denominator.targetUnits;
	},

	//
	// converting methods
	//

	toString: function(options) {
		let value = this.val();
		if (value && options && options.precision) {
			return value.toPrecision(options.precision) + ' ' + this.targetUnits;
		} else if (value && options && options.fixed) {
			return value.toFixed(options.fixed) + ' ' + this.targetUnits;
		} else {
			return value + ' ' + this.targetUnits;
		}
	},

	debug: function() {
		if (this.numerator) {
			return this.num() + ' ' + this.rate() + ' is ' + this.val() + ' ' + this.targetRate();
		} else {
			return this.value + ' ' + this.units + ' is ' + this.val() + ' ' + this.targetUnits;
		}
	}
});

//
// static attributes
//

Units.table = {};
Units.prefixes = ['Y', 'Z', 'E', 'P', 'T', 'G', 'M', 'k', 'h', 'da', '', 'd', 'c', 'm', 'u', 'n', 'p', 'f', 'a', 'z', 'y'];
Units.factors = [24, 21, 18, 15, 12, 9, 6, 3, 2, 1, 0, -1, -2, -3, -6, -9, -12, -15, -18, -21, -24];

// base units
//
Units.units = [
	'm', 	// length (meters)
	'g', 	// weight (grams)
	'l', 	// volume (liters)
	's', 	// time (seconds)
	'deg',	// angle (degrees)
	'j',	// energy (joules)
	'pa', 	// pressure (pascals)
	'usd'	// currency (us dollars)
];

//
// static methods
//
Units.toString = function(units, power) {
	if (!power || power == 1) {
		return units;
	} else if (power == -1) {
		return '/' + units;
	} else if (power < 1) {
		return '/' + units + '^' + power;
	} else {
		return units + '^' + power;
	}
};

Units.addUnits = function(baseUnits, actualUnits, multiplier) {
	if (typeof actualUnits == 'string') {
		Units.table[actualUnits] = {
			base: baseUnits, 
			actual: actualUnits, 
			multiplier: multiplier
		};	
	} else if (actualUnits.length > 0) {
		for (let i = 0; i < actualUnits.length; i++) {
			Units.table[actualUnits[i]] = {
				base: baseUnits, 
				actual: actualUnits[i], 
				multiplier: multiplier
			};		
		}
	}
};

Units.parse = function(string, options) {
	// split by first alphabetical character
	//
	let digits = string.split(/[A-Za-z]/, 1)[0].trim();
	let units = string.substring(digits.length).trim();
	if (!units || units == 'nbsp;') {
		return "Units are required.";
	} else if (units in this.table) {
		if (options && options.base) {
			if (options.base != this.table[units].base) {
				return "Invalid base units.";
			}
		}
		// parse units 
		//
		let value = parseFloat(digits);
		return new Units(value, units);		
	} else {
		return "Invalid units.";
	}
};

// initialization
//
for (let i = 0; i < Units.units.length; i++) {
	let base = Units.units[i];
	for (let i = 0; i < Units.prefixes.length; i++) {
		Units.addUnits(base, Units.prefixes[i] + base, 10 ** Units.factors[i]);
	}
}

// add US units of length
//
Units.addUnits('m', ['inch', 'in'], 0.0254);
Units.addUnits('m', ['feet', 'ft'], 0.3048);
Units.addUnits('m', ['yard', 'yd'], 0.9144);
Units.addUnits('m', ['mile', 'mi'], 1609.34);

// add imperial units of length
//
Units.addUnits('m', ['rod', 'rd'], 5.0292);
Units.addUnits('m', ['chain', 'ch'], 20.1168);
Units.addUnits('m', ['furlong', 'fur'], 201.168);
Units.addUnits('m', ['nautical mile', 'nmi'], 1852);

// add US units of mass / weight
//
Units.addUnits('g', ['ounce', 'oz'], 28.3495231);
Units.addUnits('g', ['pound', 'lb'], 453.59237);
Units.addUnits('g', ['ton', 'tn'], 907185);

// add imperial units of mass / weight
//
Units.addUnits('g', ['grain', 'gr'], 0.0647989);
Units.addUnits('g', ['drachm', 'dr'], 0.5643833);
Units.addUnits('g', ['stone', 'st'], 6350.29);
Units.addUnits('g', ['imperial ton', 't'], 1.016e6);

// add US  units of volume
//
Units.addUnits('l', ['teaspoon', 'tsp'], 0.00492892);
Units.addUnits('l', ['tablespoon', 'tbsp'], 0.0147868);
Units.addUnits('l', ['ounce', 'fl oz'], 0.0295735);
Units.addUnits('l', ['cup', 'cp'], 0.24);
Units.addUnits('l', ['pint', 'pt'], 0.473176);
Units.addUnits('l', ['quart', 'qt'], 0.946353);
Units.addUnits('l', ['gallon', 'gal'], 3.78541);

// add imperial units of volume
//	
Units.addUnits('l', ['imperial teaspoon', 'imp tsp'], 0.00591939);
Units.addUnits('l', ['imperial tablespoon', 'imp tbsp'], 0.0177582);
Units.addUnits('l', ['imperial ounce', 'imp oz'], 0.0284131);
Units.addUnits('l', ['imperial cup', 'imp cp'], 0.284131);
Units.addUnits('l', ['imperial pint', 'imp pt'], 0.568261);
Units.addUnits('l', ['imperial quart', 'imp qt'], 1.13652);
Units.addUnits('l', ['imperial gallon', 'imp gal'], 4.54609);

// add units of time
//
Units.addUnits('s', ['min', "'"], 60);
Units.addUnits('s', ['hr', '"'], 3600);
Units.addUnits('s', ['day', 'd'], 86400);
Units.addUnits('s', ['week', 'wk'], 604800);
Units.addUnits('s', ['month', 'mn'], 2.628e6);
Units.addUnits('s', ['year', 'yr'], 3.154e7);

// add angular units
//
Units.addUnits('deg', ['arcseconds', '"'], 1 / 3600);
Units.addUnits('deg', ['arcminutes', "'"], 1 / 60);
Units.addUnits('deg', ['grad', 'gon'], 360 / 400);
Units.addUnits('deg', ['sextant', 'sxt'], 60);
Units.addUnits('deg', ['radians', 'rad'], 180 / Math.PI);
Units.addUnits('deg', ['quadrant', 'quad'], 90);
Units.addUnits('deg', ['turn', 'tr'], 360);

// add units of energy
//
Units.addUnits('j', ['calorie', 'cal'], 4.184);
Units.addUnits('j', ['kilocalorie', 'kcal'], 4184);
Units.addUnits('j', ['watt hour', 'wh'], 3600);
Units.addUnits('j', ['kilowatt hour', 'kwh'], 3.6e6);
Units.addUnits('j' ,['electron volt', 'ev'], 1.6022e-19);
Units.addUnits('j' ,['british thermal unit', 'btu'], 1055.06);
Units.addUnits('j' ,['therm', 'thm'], 1.055e+8);
Units.addUnits('j' ,['foot pound', 'ft lb'], 1.35582);

// add units of pressure
//
Units.addUnits('pa', ['bar', 'b'], 100000);
Units.addUnits('pa', ['atmosphere', 'atm'], 101325);
Units.addUnits('pa', ['pounds per square inch', 'ppi'], 6894.76);
Units.addUnits('pa', ['torr'], 133.32242079569);

// add units of currency
//
Units.addUnits('usd', ['euro', 'eur'], 1.1);
Units.addUnits('usd', ['pound', 'gbp'], 1.25);
Units.addUnits('usd', ['yen', 'jpy'], 0.01);
Units.addUnits('usd', ['swiss franc', 'chf'], 1);
Units.addUnits('usd', ['australian dollar', 'aud'], 0.75);

export default Units;
