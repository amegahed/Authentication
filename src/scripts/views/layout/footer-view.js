/******************************************************************************\
|                                                                              |
|                                 footer-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application footer and associated content.           |
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
		<div class="footer container">
			<hr>
			Copyright &copy; 2015 &ltYour Name or Organization Name Here&gt
		</div>
	`)
});
