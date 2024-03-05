/******************************************************************************\
|                                                                              |
|                                  my-account-view.js                          |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a view for viewing the user's account information.       |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import UserProfileFormView from '../../../views/users/accounts/forms/user-profile-form-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1><div class="icon"><i class="fa fa-user"></i></div>My Account</h1>
		
		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-user"></i>My Account</li>
		</ol>
		
		<div id="user-profile">
		</div>
		
		<div class="buttons">
			<button id="edit" class="btn btn-primary btn-lg"><i class="fa fa-pencil"></i>Edit Profile</button>
			<button id="change-password" class="btn btn-lg"><i class="fa fa-keyboard-o"></i>Change Password</button>
			<button id="delete-account" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Account</button>
		</div>
	`),

	regions: {
		user_profile: "#user-profile"
	},

	events: {
		"click #edit": "onClickEdit",
		"click #change-password": "onClickChangePassword",
		"click #reset-password": "onClickResetPassword",
		"click #delete-account": "onClickDeleteAccount"
	},

	//
	// methods
	//

	initialize: function() {

		// set model to current user
		//
		this.model = application.session.user;
	},

	//
	// rendering methods
	//

	onRender: function() {

		// display child views
		//
		this.showChildView('user_profile', new UserProfileFormView({
			model: this.model,
			parent: this
		}));
	},

	//
	// utility methods
	//

	deleteAccount: function() {

		// confirm delete
		//
		application.confirm({
			title: "Delete My Account",
			message: "Are you sure that you would like to delete your user account? " +
				"When you delete an account, all of your user data will permanantly deleted.",

			// callbacks
			//
			accept: () => {

				// delete user
				//
				this.model.destroy({

					// callbacks
					//
					success: () => {

						// show success notification dialog
						//
						application.notify({
							title: "My Account Deleted",
							message: "Your user account has been successfuly deleted.",

							// callbacks
							//
							accept: () => {

								// end session
								//
								application.session.logout({

									// callbacks
									//
									success: () => {

										// go to welcome view
										//
										Backbone.history.navigate("#", {
											trigger: true
										});
									},
									
									error: (jqxhr, textstatus, errorThrown) => {

										// show error dialog
										//
										application.error({
											message: "Could not log out: " + errorThrown + "."
										});
									}
								});
							}
						});
					},

					error: () => {

						// show error dialog
						//
						application.error({
							message: "Could not delete your user account."
						});
					}
				});
			}
		});
	},

	//
	// event handling methods
	//

	onClickEdit: function() {
		Backbone.history.navigate("#my-account/edit", {
			trigger: true
		});
	},

	onClickChangePassword: function() {
		import(
			'../../../views/users/accounts/dialogs/change-password-dialog-view.js'
		).then((ChangePasswordDialogView) => {

			// show change password dialog
			//
			application.show(new ChangePasswordDialogView.default({
				parent: this
			}));
		});
	},

	onClickResetPassword: function() {
		import(
			'../../../views/users/dialogs/reset-password-dialog-view.js'
		).then((ResetPasswordDialogView) => {

			// show reset password dialog
			//
			application.show(new ResetPasswordDialogView.default({
				username: application.session.user.get('username'),
				parent: this
			}));
		});
	},

	onClickDeleteAccount: function() {
		this.deleteAccount();
	}
});
