/******************************************************************************\
|                                                                              |
|                                   main.js                                    |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application entry point and loading.                 |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.txt', which is part of this source code distribution.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import '../library/jquery/jquery-3.6.0.js';
import '../library/jquery/jquery-ui/jquery-ui.js';
import '../library/jquery/mouse-wheel/jquery.mousewheel.js';
import '../library/lodash/lodash.js';
import '../library/backbone/backbone.js';
import '../library/backbone/marionette/backbone.marionette.js';

// load configuration files
//
Promise.all([
	fetch('config/config.json').then(response => response.json()),
]).then((files) => {
	window.config = files[0];

	// go!
	//
	$(document).ready(() => {
		import('./application.js').then((Application) => {

			// set global for future reference
			//
			application = new Application.default();

			// go!
			//
			$(document).ready(function() {
				application.start();
			});
		});
	});
});