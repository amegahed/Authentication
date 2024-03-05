/******************************************************************************\
|                                                                              |
|                                    main-view.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the main single column outer container view.             |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../views/base-view.js';
import HeaderView from './header-view.js';
import FooterView from './footer-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	id: 'page',

	template: _.template(`
		<div id="header"></div>
		
		<div class="main container">
			<div class="content">
			</div>
		</div>
		
		<div id="footer"></div>
	`),

	regions: {
		header: "#header",
		content: '.content',
		footer: "#footer"
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showHeader();
		this.showContent();
		this.showFooter();
	},

	showHeader: function(options) {

		// use default template
		//
		this.showChildView('header', new HeaderView({
			nav: options && options.nav? options.nav : "home"
		}));

		// perform callback
		//
		if (options && options.done) {
			options.done();
		}
	},

	showContent: function() {
		if (this.options.contentView) {
			this.showChildView('content', this.options.contentView);
		}
	},

	showFooter: function(options) {
		this.showChildView('footer', new FooterView());

		// perform callback
		//
		if (options && options.done) {
			options.done();
		}
	}
});
