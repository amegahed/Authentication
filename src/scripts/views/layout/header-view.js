/******************************************************************************\
|                                                                              |
|                                 header-view.js                               |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the application header and associated content.           |
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
		<div class="navbar navbar-default navbar-fixed-top navbar-inverse">
			<div class="container">
		
				<!-- mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					</button>
					<a id="brand" class="active navbar-brand">&ltBRAND&gt</a>
				</div>
		
				<!-- normal display -->
				<div id="navbar" class="collapse navbar-collapse">
					<ul class="nav navbar-nav">
						<li<% if (nav == 'about') {%> class="active" <% } %>><a id="about"><i class="fa fa-info-circle"></i>About</a></li>
						<li<% if (nav == 'contact') {%> class="active" <% } %>><a id="contact"><i class="fa fa-comment"></i>Contact</a></li>
						<li<% if (nav == 'help') {%> class="active" <% } %>><a id="help"><i class="fa fa-question-circle"></i>Help</a></li>
					</ul>
		
					<ul class="nav navbar-nav navbar-right">
						<% if (user) { %>
						<li<% if (nav == 'my-account') {%> class="active" <% } %>><a id="my-account"><i class="fa fa-user"></i><%= user.get('username') %></a></li>
						<% } %>
						<div class="navbar-form navbar-right">
							<% if (user) { %>
							<button id="sign-out" class="btn btn-primary"><i class="fa fa-chevron-left"></i>Sign Out</button>
							<% } else { %>
							<button id="sign-in" class="btn btn-primary"><i class="fa fa-chevron-right"></i>Sign In</button>
							<button id="sign-up" class="btn"><i class="fa fa-pencil"></i>Sign Up</button>
							<% } %>
						</div>
					</ul>
				</div>
			</div>
		</div>
	`),

	events: {
		'click #brand': 'onClickBrand',
		'click #about': 'onClickAbout',
		'click #contact': 'onClickContact',
		'click #help': 'onClickHelp',
		'click #my-account': 'onClickMyAccount',
		'click #sign-in': 'onClickSignIn',
		'click #sign-up': 'onClickSignUp',
		'click #sign-out': 'onClickSignOut'
	},

	//
	// rendering methods
	//

	templateContext: function(data) {
		return {
			nav: this.options.nav,
			user: application.session.user
		};
	},

	//
	// event handling methods
	//

	onClickBrand: function() {
		if (application.session.user) {

			// if user logged in, go to home view
			//
			Backbone.history.navigate('#home', {
				trigger: true
			});
		} else {

			// go to welcome view
			//
			Backbone.history.navigate('#', {
				trigger: true
			});
		}
	},

	onClickAbout: function() {
		Backbone.history.navigate('#about', {
			trigger: true
		});
	},

	onClickContact: function() {
		Backbone.history.navigate('#contact', {
			trigger: true
		});
	},

	onClickHelp: function() {
		Backbone.history.navigate('#help', {
			trigger: true
		});
	},

	onClickMyAccount: function() {
		Backbone.history.navigate('#my-account', {
			trigger: true
		});
	},

	onClickSignIn: function() {
		import(
			'../../views/users/authentication/dialogs/sign-in-dialog-view.js'
		).then((SignInDialogView) => {

			// show sign in dialog
			//
			application.show(new SignInDialogView.default({
				// className: 'wide'
			}));
		});
	},

	onClickSignUp: function() {
		Backbone.history.navigate('#register', {
			trigger: true
		});
	},

	onClickSignOut: function() {
		application.logout();
	}
});
