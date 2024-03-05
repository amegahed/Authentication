/******************************************************************************\
|                                                                              |
|                             sign-in-dialog-view.js                           |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an notification dialog that is used to show a            |
|        modal sign in dialog box.                                             |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import DialogView from '../../../../views/dialogs/dialog-view.js';
import SignInFormView from '../../../../views/users/authentication/forms/sign-in-form-view.js';

export default DialogView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			<h1 id="modal-header-text">
				Sign In
			</h1>
		</div>
		
		<div class="modal-body">
		</div>
		
		<div class="modal-footer">
			<button id="cancel" class="btn" data-dismiss="modal"><i class="fa fa-times"></i>Cancel</button>
			<button id="ok" class="btn btn-primary"><i class="fa fa-check"></i>OK</button>
		</div>
	`),

	regions: {
		form: '.modal-body'
	},

	events: {
		'click #ok': 'onClickOk',
		'click .alert .close': 'onClickAlertClose',
		'keypress': 'onKeyPress'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showChildView('form', new SignInFormView());
	},

	//
	// methods
	//

	showHome: function() {

		// remove event handlers
		//
		this.undelegateEvents();

		// go to home view
		//
		Backbone.history.navigate('#home', {
			trigger: true
		});
	},

	//
	// event handling methods
	//

	onSignIn: function() {
		
		// get user information
		//
		application.session.getUser({

			// callbacks
			//
			success: (user) => {
				application.session.user = user;
				this.showHome();
			}
		});

		// close modal dialog
		//
		this.hide();
	},

	//
	// mouse event handling methods
	//

	onClickOk: function() {
		this.getChildView('form').submit({

			// callbacks
			//
			success: () => {
				this.onSignIn();
			}
		});
	},

	onKeyPress: function(event) {

		// respond to enter key press
		//
		if (event.keyCode === 13) {
			this.onClickOk();
		}
	}
});
