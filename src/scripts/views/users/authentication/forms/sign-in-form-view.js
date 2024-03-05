/******************************************************************************\
|                                                                              |
|                              sign-in-form-view.js                            |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines a form view used for user authentication.                |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div class="username form-group">
			<label class="control-label">Username</label>
			<div class="col-sm-6 col-xs-12">
				<div class="input-group">
					<input type="text" class="form-control">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="This is the username that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>
		
		<div class="password form-group">
			<label class="control-label">Password</label>
			<div class="col-sm-6 col-xs-12">
				<div class="input-group">
					<input type="password" class="form-control" maxlength="200">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="This is the password that you specified when you registered."></i>
					</div>
				</div>
			</div>
		</div>
		</div>
		
		<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Error: </label><span class="message">User name and password are not correct.  Please try again.</span>
		</div>
		
		<hr>
		
		<a id="reset-password" class="fineprint">Reset my password</a>
		<br />
		<a id="request-username" class="fineprint">Request my username</a>
	`),

	events: {
		'click .alert .close': 'onClickAlertClose',
		'click #reset-password': 'onClickResetPassword',
		'click #request-username': 'onClickRequestUsername',
		'keypress': 'onKeyPress'
	},

	//
	// form methods
	//

	getValue: function(key, value) {
		switch (key) {
			case 'username':
				return this.$el.find('.username input').val();
			case 'password':
				return this.$el.find('.password input').val();
		}
	},

	getValues: function() {
		return {
			username: this.getValue('username'),
			password: this.getValue('password')
		};
	},
	//
	// rendering methods
	//

	onRender: function() {

		// display popovers on hover
		//
		this.$el.find('[data-toggle="popover"]').popover({
			trigger: 'hover'
		});
	},

	showWarning: function(message) {
		this.$el.find('.alert-warning .message').html(message);
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// methods
	//

	submit: function(options) {
		let values = this.getValues();

		// send login request
		//
		application.session.login(values.username, values.password, {
			crossDomain: true,
			
			// callbacks
			//
			success: () => {

				// perform callback
				//
				if (options && options.success) {
					options.success();
				}
			},

			error: (response, statusText, errorThrown) => {
				if (response.status == 403) {
					window.location = application.getURL() + 'block/index.html';
				} else {
					if (response.responseText == "User email has not been verified.") {
						this.showEmailVerificationDialog({
							username: username,
							password: password
						});
					} else if (response.responseText == '') {
						this.showWarning("Log in request failed. It appears that you may have lost internet connectivity.  Please check your internet connection and try again.");
					} else {
						this.showWarning(response.responseText);
					}
				}
			}
		});
	},

	//
	// dialog rendering methods
	//

	showResetPasswordDialog: function() {
		import(
			'../../../../views/users/reset-password/dialogs/reset-password-dialog-view.js'
		).then((ResetPasswordDialogView) => {
			application.show(new ResetPasswordDialogView.default({
				parent: this
			}));
		});
	},

	showRequestUsernameDialog: function() {
		import(
			'../../../../views/users/request-username/dialogs/request-username-dialog-view.js'
		).then((RequestUsernameDialogView) => {
			application.show(new RequestUsernameDialogView.default({
				parent: this
			}));
		});
	},

	showEmailVerificationDialog: function(options) {
		import(
			'../../../../views/users/email-verification/dialogs/email-verification-error-dialog-view.js'
		).then((EmailVerificationErrorDialogView) => {
			application.show(new EmailVerificationErrorDialogView.default(options));
		});
	},

	//
	// event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickResetPassword: function() {
		this.showResetPasswordDialog();
		this.parent.close();
	},

	onClickRequestUsername: function() {
		this.showRequestUsernameDialog();
		this.parent.close();
	}
});
