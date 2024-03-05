/******************************************************************************\
|                                                                              |
|                                    home-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the home view that the user sees upon login.             |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	template: _.template(`
		<h1><div class="icon"><i class="fa fa-home"></i></div>Home</h1>

		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	`)
});