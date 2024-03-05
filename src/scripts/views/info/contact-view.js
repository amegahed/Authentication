/******************************************************************************\
|                                                                              |
|                                  contact-view.js                             |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the contact information view of the application.         |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';

export default BaseView.extend({

	//
	// attributes
	//
	
	template: _.template(`
		<h1><i class="fa fa-comment"></i>Contact</h1>

		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-comment"></i>Contact</li>
		</ol>

		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	`)
});
