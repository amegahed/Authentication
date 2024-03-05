/******************************************************************************\
|                                                                              |
|                               edit-my-account-view.js                        |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for editing the user's account information.       |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../../views/base-view.js';
import EditableUserProfileFormView from '../../../../views/users/accounts/forms/editable-user-profile-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1><div class="icon"><i class="fa fa-pencil"></i></div>Edit My Profile</h1>
		
		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><a href="#my-account"><i class="fa fa-user"></i>My Account</a></li>
			<li><i class="fa fa-pencil"></i>Edit My Profile</li>
		</ol>
		
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
			<strong>Error: </strong>This form contains errors.  Please correct and resubmit.
		</div>
				
		<div id="user-profile-form">
		</div>
		
		<div class="buttons">
			<button id="save" class="btn btn-primary btn-lg"><i class="fa fa-save"></i>Save</button>
			<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
		</div>
	`),

	regions: {
		form: "#user-profile-form"
	},

	events: {
		"click .alert .close": "onClickAlertClose",
		"click #save": "onClickSave",
		"click #cancel": "onClickCancel"
	},

	//
	// methods
	//

	initialize: function() {
		this.model = application.session.user;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// show child views
		//
		this.showChildView('form', new EditableUserProfileFormView({
			model: this.model
		}));
	},

	showWarning: function() {
		this.$el.find(".alert-warning").show();
	},

	hideWarning: function() {
		this.$el.find(".alert-warning").hide();
	},

	//
	// event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickSave: function() {

		// check validation
		//
		if (!this.getChildView('form').submit({

			// callbacks
			//
			success: () => {

				// update user name in header (if changed)
				//
				application.update();

				// return to my account view
				//
				Backbone.history.navigate("#my-account", {
					trigger: true
				});
			},

			error: () => {

				// show error dialog
				//
				application.error({
					message: "Could not save user profile changes."
				});
			}
		})) {
			this.showWarning();
		}
	},

	onClickCancel: function() {

		// go to my account view
		//
		Backbone.history.navigate("#my-account", {
			trigger: true
		});
	}
});
