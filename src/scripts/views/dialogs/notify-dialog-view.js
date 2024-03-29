/******************************************************************************\
|                                                                              |
|                             notify-dialog-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal notify / alert dialog box.                                      |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import DialogView from '../../views/dialogs/dialog-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h1 id="modal-header-text">
				<% if (title) { %>
				<%= title %>
				<% } else { %>
				Notification
				<% } %>
			</h1>
		</div>
		
		<div class="modal-body">
			<i class="alert-icon fa fa-3x fa-info-circle" style="float:left; margin-left:10px; margin-right:20px"></i>
			<p><%= message %></p>
		</div>
		
		<div class="modal-footer">
			<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
		</div>
	`),

	events: {
		'click #ok': 'onClickOk',
		'keypress': 'onKeyPress'
	},

	//
	// rendering methods
	//

	templateContext: function() {
		return {
			title: this.options.title,
			message: this.options.message
		};
	},

	//
	// event handling methods
	//

	onClickOk: function() {

		// perform callback
		//
		if (this.options.accept) {
			this.options.accept();
		}
	},

	onKeyPress: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {

			// close modal dialog
			//
			this.dialog.hide();

			// perform callback
			//
			this.onClickOk();
		}
	}
});
