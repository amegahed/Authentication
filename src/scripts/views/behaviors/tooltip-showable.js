/******************************************************************************\
|                                                                              |
|                             tooltip-showable.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a behavior for displaying tooltips.                      |
|                                                                              |
|        Author(s): Abe Megahed                                                |
|                                                                              |
|        This file is subject to the terms and conditions defined in           |
|        'LICENSE.md', which is part of this source code distribution.         |
|                                                                              |
|******************************************************************************|
|        Copyright (C) 2016-2022, Megahed Labs LLC, www.sharedigm.com          |
\******************************************************************************/

import '../../../vendor/bootstrap/js/tooltip.js';
import Browser from '../../utilities/web/browser.js';

export default {

	//
	// attributes
	//

	tooltip_trigger: 'hover',
	tooltip_placement: undefined,
	tooltip_container: 'body',

	//
	// getting methods
	//

	getTooltipContainer: function() {
		return this.$el.closest('.modal-dialog, .desktop') || this.$el.parent();
	},

	//
	// rendering methods
	//

	addTooltips: function(options) {

		// no tooltips for mobile
		//
		if (Browser.is_mobile) {
			return;
		}

		// show tooltips on trigger
		//
		this.$el.find('[data-toggle="tooltip"]').addClass('tooltip-trigger').tooltip(_.extend(this.options, {
			trigger: this.tooltip_trigger,
			placement: this.tooltip_placement,
			container: this.tooltip_container
		}, options));
	},

	removeTooltips: function() {
		$('body').find('.tooltip').remove();
	}
};