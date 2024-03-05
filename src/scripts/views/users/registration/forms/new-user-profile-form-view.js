/******************************************************************************\
|                                                                              |
|                           new-user-profile-form-view.js                      |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines an editable form view of a new user's profile            |
|        information.                                                          |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import FormView from '../../../../views/forms/form-view.js';
import EditableUserProfileFormView from '../../../../views/users/accounts/forms/editable-user-profile-form-view.js';
import CountrySelectorView from '../../../../views/selectors/country-selector-view.js';
import AlphaNumericRules from '../../../../views/forms/rules/alphanumeric-rules.js';
import AuthenticationRules from '../../../../views/forms/rules/authentication-rules.js';
import '../../../../utilities/security/password-policy.js';

export default FormView.extend({

	//
	// attributes
	//

	template: _.template(`
		<div id="user-profile"></div>

		<fieldset>
			<legend>Account info</legend>

			<div class="form-group" id="username">
				<label class="required control-label">Username</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="text" class="required form-control" name="username" value="<%= username %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Username" data-content="Your username is the name that you use to sign in to the web site."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="password">
				<label class="required control-label">Password</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="password" class="form-control" autocomplete="off" name="password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Password" data-content="Passwords must be at least 8 characters long including one uppercase letter, one lowercase letter and one number or symbol."></i>
						</div>
					</div>
					<div class="password-meter" style="display:none">
						<label class="password-meter-message"></label>
						<div class="password-meter-bg">
							<div class="password-meter-bar"></div>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="confirm-password">
				<label class="required control-label">Confirm password</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="password" class="required form-control" autocomplete="off" name="confirm-password" maxlength="200">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm password" data-content="Please retype your password exactly as you first entered it."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
		
		<fieldset>
			<legend>Verification info</legend>

			<div class="form-group" id="email" >
				<label class="required control-label">Email address</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="text" class="required email form-control" name="email" value="<%= email %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Email address" data-content="A valid email address is required and will be used for your account registration and for password recovery."></i>
						</div>
					</div>
				</div>
			</div>

			<div class="form-group" id="confirm-email">
				<label class="required control-label">Confirm email address</label>
				<div class="col-sm-6 col-xs-12">
					<div class="input-group">
						<input type="text" class="required confirm-email form-control" name="confirm-email" value="<%= email %>">
						<div class="input-group-addon">
							<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Confirm email address" data-content="Please retype your previously entered email address for verification."></i>
						</div>
					</div>
				</div>
			</div>
		</fieldset>
	`),

	regions: {
		user_profile: '#user-profile'
	},

	rules: {

		// account info rules
		//
		'username': {
			required: true,
			username: true						
		},
		'password': {
			required: true,
			passwordStrongEnough: "Your password must be stronger."
		},
		'confirm-password': {
			required: true,
			equalTo: '#password input'
		},

		// verification info rules
		//
		'email': {
			required: "Enter a valid email address",
			email: "This email address is not valid"
		},
		'confirm-email': {
			required: "Re-enter your email address",
			equalTo: "#email input"
		}
	},

	messages: {

		// account info
		//
		'confirm-password': {
			required: "Re-enter your password.",
			equalTo: "Enter the same password as above."
		},

		// verification info
		//
		'confirm-email': {
			required: "Re-enter your email address.",
			equalTo: "Retype the email address above."
		}
	},

	rule_sets: [
		AlphaNumericRules, AuthenticationRules
	],

	//
	// form methods
	//

	getValue: function(key) {
		switch (key) {
			case 'email':
				return this.$el.find('#email input').val();
			case 'username':
				return this.$el.find('#username input').val();
			case 'password':
				return this.$el.find('#password input').val();
			default:
				// this.getChildView('user_profile').getValue(key);
		}
	},

	getValues: function() {
		let values = this.getChildView('user_profile').getValues();
		return _.extend(values || {}, {
			'email': this.getValue('email'),
			'username': this.getValue('username'),
			'password': this.getValue('password')
		});
	},

	onRender: function() {
		FormView.prototype.onRender.call(this);

		// show child views
		//
		this.showChildView('user_profile', new EditableUserProfileFormView({
			model: this.model
		}));
	}
});
