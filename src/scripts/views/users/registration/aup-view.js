/******************************************************************************\
|                                                                              |
|                                    aup-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the acceptable use policy view used in the new           |
|        user registration process.                                            |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import BaseView from '../../../views/base-view.js';
import UserRegistrationView from '../../../views/users/registration/user-registration-view.js';

export default BaseView.extend({

	//
	// attributes
	//

	template: _.template(`
		<h1><i class="fa fa-file-text"></i>Acceptable Use Policy</h1>
		
		<ol class="breadcrumb">
			<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
			<li><i class="fa fa-file-text"></i>Acceptable Use Policy</li>
		</ol>
		
		<h2>Terms and Conditions</h2>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
		tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
		quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
		consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
		cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
		proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		
		<h2>Statement of Agreement</h2>
		<p>By clicking 'I Accept' it serves as acknowledgement that you have read and understand the Terms and Conditions.</p>
		
		<div class="alert alert-warning" style="display:none">
			<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
			<label>Error: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
		</div>
		
		<form action="/" id="aup-form">
			<div class="checkbox well">
				<label>
					<input type="checkbox" name="accept" id="accept" class="required" >
					I accept
				</label>
			</div>
		</form>
		
		<div class="buttons">
			<button id="submit" class="btn btn-primary btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
			<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
		</div>
	`),

	events: {
		'click .alert .close': 'onClickAlertClose',
		'click #submit': 'onClickSubmit',
		'click #cancel': 'onClickCancel'
	},

	//
	// rendering methods
	//

	onRender: function() {

		// validate form
		//
		this.validator = this.validate();
	},

	showWarning: function() {
		this.$el.find('.alert-warning').show();
	},

	hideWarning: function() {
		this.$el.find('.alert-warning').hide();
	},

	//
	// form validation methods
	//

	validate: function() {

		// validate form
		//
		return this.$el.find('#aup-form').validate({
			rules: {
				'accept': {
					required: true
				}
			},
			messages: {
				'accept': {
					required: "You must accept the terms to continue."
				}
			}
		});
	},

	isValid: function() {
		return this.validator.form();
	},

	//
	// event handling methods
	//

	onClickAlertClose: function() {
		this.hideWarning();
	},

	onClickSubmit: function() {

		// check validation
		//
		if (this.isValid()) {
			this.undelegateEvents();

			if (this.options && this.options.accept) {
				this.options.accept();
			} else {

				// show next view
				//
				application.show(new UserRegistrationView());
			}
		} else {
			this.showWarning();
		}
	},

	onClickCancel: function() {

		// go to home view
		//
		Backbone.history.navigate('#home', {
			trigger: true
		});
	}
});
