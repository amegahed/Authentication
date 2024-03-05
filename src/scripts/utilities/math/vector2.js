/******************************************************************************\
|                                                                              |
|                                  vector2.js                                  |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a two dimensional vector type and its operations.        |
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

function Vector2(x, y) {
	// set attributes
	//
	this.x = x;
	this.y = y;
	
	return this;
}

_.extend(Vector2.prototype, {

	//
	// querying methods
	//

	equals: function(vector) {
		return (vector && (this.x == vector.x) && (this.y == vector.y));
	},

	isTowards: function(vector) {
		return this.dot(vector) > 0;
	},

	isAwayFrom: function(vector) {
		return this.dot(vector) < 0;
	},

	isPerpendicularTo: function(vector) {
		return this.dot(vector) == 0;
	},

	isParallelTo: function(vector) {
		return this.dot(vector) == Math.sqrt(this.dot(this) * vector.dot(vector));
	},

	//
	// converting methods
	//

	clone: function() {
		return new Vector2(this.x, this.y);
	},

	toString: function(separator, precision) {
		
		// set optional parameter defaults
		//
		if (!separator) {
			separator = Vector2.separator;
		}
		if (!precision) {
			precision = Vector2.precision;
		}
		// convert to string
		//
		return this.x.toPrecision(precision) + separator + this.y.toPrecision(precision);
	},

	//
	// vector arithmetic methods
	//

	add: function(vector) {
		this.x = this.x + vector.x;
		this.y = this.y + vector.y;
	},

	subtract: function(vector) {
		this.x = this.x - vector.x;
		this.y = this.y - vector.y;
	},

	multiplyBy: function(vector) {
		this.x = this.x * vector.x;
		this.y = this.y * vector.y;
	},

	divideBy: function(vector) {
		this.x = this.x / vector.x;
		this.y = this.y / vector.y;
	},

	scaleBy: function(scalar) {
		this.x = this.x * scalar;
		this.y = this.y * scalar;
	},

	reverse: function() {
		this.scaleBy(-1);
	},

	normalize: function() {
		this.scaleBy(1 / this.length());
	},

	//
	// vector functing methods
	//

	plus: function(vector) {
		let x = this.x + vector.x;
		let y = this.y + vector.y;
		return new Vector2(x, y);
	},

	minus: function(vector) {
		let x = this.x - vector.x;
		let y = this.y - vector.y;
		return new Vector2(x, y);
	},

	times: function(vector) {
		let x = this.x * vector.x;
		let y = this.y * vector.y;
		return new Vector2(x, y);
	},

	dividedBy: function(vector) {
		let x = this.x / vector.x;
		let y = this.y / vector.y;
		return new Vector2(x, y);
	},

	scaledBy: function(scalar) {
		let x = this.x * scalar;
		let y = this.y * scalar;
		return new Vector2(x, y);
	},

	reversed: function() {
		return this.scaledBy(-1);
	},

	normalized: function() {
		return this.scaledBy(1 / this.length());
	},

	parallel: function(vector) {
		return vector.scaledBy(this.dot(vector) / vector.dot(vector));
	},

	perpendicular: function(vector) {
		return this.minus(this.parallel(vector));
	},

	toPerpendicular: function() {
		return new Vector2(-this.y, this.x);
	},

	towards: function(vector) {
		if (this.isTowards(vector)) {
			return this.clone();
		} else {
			return this.reversed();
		}
	},

	awayFrom: function(vector) {
		if (this.isAwayFrom(vector)) {
			return this.clone();
		} else {
			return this.reversed();
		}
	},

	//
	// operators
	// 

	dot: function(vector) {
		return (this.x * vector.x) + (this.y * vector.y);
	},

	determinant: function(vector) {
		return (this.x * vector.y) - (vector.x * this.y);
	},

	length: function() {
		return Math.sqrt(this.dot(this));
	},

	//
	// rotating methods
	//

	rotateBy: function(angle) {
		let x = this.x * Math.cos(angle * Math.PI/180) - this.y * Math.sin(angle * Math.PI/180);
		let y = this.x * Math.sin(angle * Math.PI/180) + this.y * Math.cos(angle * Math.PI/180);
		this.x = x;
		this.y = y;
	},

	rotatedBy: function(angle) {
		let x = this.x * Math.cos(angle * Math.PI/180) - this.y * Math.sin(angle * Math.PI/180);
		let y = this.x * Math.sin(angle * Math.PI/180) + this.y * Math.cos(angle * Math.PI/180);
		return new Vector2(x, y);
	},

	//
	// converting methods
	//

	toArray: function() {
		return [this.x, this.y];
	}
});

//
// "class" or "static" members
//

Vector2.precision = 3;
Vector2.separator = ", ";

export default Vector2;