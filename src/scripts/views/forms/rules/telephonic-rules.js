/******************************************************************************\
|                                                                              |
|                             telephonic-rules.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This is collection of form validation rules.                          |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2022, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

export default {

	//
	// form validation rules
	//

	ITUE164Format: {
		method: (value, element) => { 

			// allow empty values for optional fields
			//
			if (value == '') {
				return !$(element).hasClass('required');
			}

			let form = $(element).closest('form');
			var countryCode = form.find('#country-code').val();
			var areaCode = form.find('#area-code').val();
			var phoneNumber = form.find('#phone-number').val();
			var number = countryCode + areaCode + phoneNumber;
			var numberWithoutSymbols = number.replace(/\D/g,'');
			return numberWithoutSymbols.length <= 15;
		},
		message: 'Country + Area + Phone # can\'t be longer than 15 digits'
	},

	usPhoneNumber: {
		method: (value, element) => {

			// allow empty values for optional fields
			//
			if (value == '') {
				return !$(element).hasClass('required');
			}

			var numberWithoutSymbols = value.replace(/\D/g,'');
			return numberWithoutSymbols.length == 7;
		},
		message: 'U.S. phone numbers must be 7 digits long'
	},

	usAreaCode: {
		method: (value, element) => {

			// allow empty values for optional fields
			//
			if (value == '') {
				return !$(element).hasClass('required');
			}

			return value.length == 3;
		},
		message: 'U.S. area codes must be 3 digits long'
	}
};
