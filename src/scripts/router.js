/******************************************************************************\
|                                                                              |
|                                  main-router.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the url routing that's used for this application.        |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

export default Backbone.Router.extend({

	//
	// route definitions
	//

	routes: {

		// main routes
		//
		'': 'showWelcome',

		'about': 'showAbout',
		'contact': 'showContact',
		'help': 'showHelp',
		
		// user registration routes
		//
		'register': 'showRegister',
		'register/verify-email/:id': 'showVerifyEmail',
	
		// email change verification
		//
		'verify-email/:id': 'showVerifyEmailChange',

		// password reset routes
		//
		'reset-password/:id': 'showResetPassword',

		// my account routes
		//
		'home': 'showHome',
		'my-account': 'showMyAccount',
		'my-account/edit': 'showEditMyAccount',

		// administration routes
		//
		'overview': 'showSystemOverview',
		'accounts/review(?*query_string)': 'showReviewAccounts',

		// user account routes
		//
		'accounts/:id(/:nav)': 'showUserAccount'
	},

	//
	// route handlers
	//

	showWelcome: function() {
		import(
			'./views/welcome-view.js'
		).then((WelcomeView) => {
			let user = application.session.user;

			// if user is logged in
			//
			if (user && (user.user_uid !== 'current')) {

				// go to home view
				//
				this.navigate('#home', {
					trigger: true
				});

				return;
			}

			// show welcome view
			//
			application.show(new WelcomeView.default());
		});
	},

	showAbout: function() {
		import(
			'./views/info/about-view.js'
		).then((AboutView) => {

			// show about view
			//
			application.show(new AboutView.default(), {
				nav: 'about'
			});
		});
	},

	showContact: function() {
		import(
			'./views/info/contact-view.js'
		).then((ContactView) => {

			// show contact view
			//
			application.show(new ContactView.default(), {
				nav: 'contact'
			});
		});
	},

	showHelp: function() {
		import(
			'./views/info/help-view.js'
		).then((HelpView) => {

			// show help view
			//
			application.show(new HelpView.default(), {
				nav: 'help'
			});
		});
	},

	//
	// user registration route handlers
	//

	showRegister: function() {
		import(
			'./views/users/registration/aup-view.js'
		).then((AUPView) => {

			// show aup view
			//
			application.show(new AUPView.default());
		});
	},

	showVerifyEmail: function(id) {
		Promise.all([
			import('./models/users/user.js'), 
			import('./models/users/email-verification.js'), 
			import('./views/users/email-verification/verify-email-view.js')
		]).then(([User, EmailVerification, VerifyEmailView]) => {

			// fetch email verification
			//
			let emailVerification = new EmailVerification.default({
				id: id
			});

			emailVerification.fetch({

				// callbacks
				//
				success: () => {

					// fetch user corresponding to this email verification
					//
					let user = new User.default(emailVerification.get('user'));

					// show verify email view
					//
					application.show(new VerifyEmailView.default({
						model: emailVerification,
						user: user
					}));
				},

				error: () => {

					// show error dialog
					//
					application.error({
						message: "We could not verify this user."
					});
				}
			});
		});
	},

	showVerifyEmailChange: function(verificationKey) {
		Promise.all([
			import('./models/users/user.js'), 
			import('./models/users/email-verification.js'), 
			import('./views/users/registration/verify-email-changed-view.js')
		]).then((User, EmailVerification, VerifyEmailChangedView) => {

			// fetch email verification
			//
			let emailVerification = new EmailVerification.default({
				verification_key: verificationKey
			});

			emailVerification.fetch({

				// callbacks
				//
				success: () => {

					// fetch user corresponding to this email verification
					//
					let user = new User(emailVerification.get('user'));

					// show verify email changed view
					//
					application.show(new VerifyEmailChangedView({
						model: emailVerification,
						user: user
					}));
				},

				error: () => {

					// show error dialog
					//
					application.error({
						message: "We could not verify this user."
					});
				}
			});
		});
	},

	//
	// password reset route handlers
	//

	showResetPassword: function(id) {
		Promise.all([
			import('./models/users/user.js'), 
			import('./models/users/password-reset.js'), 
			import('./views/users/reset-password/reset-password-view.js'), 
			import('./views/users/reset-password/invalid-reset-password-view.js')
		]).then(([User, PasswordReset, ResetPasswordView, InvalidResetPasswordView]) => {

			// fetch password reset
			//
			new PasswordReset.default({
				'id': id
			}).fetch({

				// callbacks
				//
				success: (model) => {

					// show reset password view
					//
					application.show(new ResetPasswordView.default({
						model: model
					}));
				},

				error: () => {

					// show invalid reset password view
					//
					application.show(new InvalidResetPasswordView.default());
				}
			});
		});
	},

	//
	// my account route handlers
	//

	showHome: function(options) {
		import(
			'./views/home-view.js'
		).then((HomeView) => {
			let user = application.session.user;

			// redirect to main view
			//
			if (!user || ( user.user_uid === 'current' ) ) {
				this.navigate('#', {
					trigger: true
				});
				return;
			}

			// show home view
			//
			application.show(new HomeView.default({
				nav: options? options.nav : 'home'
			}), options);
		});
	},

	showMyAccount: function() {
		import(
			'./views/users/accounts/my-account-view.js'
		).then((MyAccountView) => {

			// show edit my account view
			//
			application.show(new MyAccountView.default(), {
				nav: 'my-account'
			});
		});
	},

	showEditMyAccount: function() {
		import(
			'./views/users/accounts/edit/edit-my-account-view.js'
		).then((EditMyAccountView) => {

			// show edit my account view
			//
			application.show(new EditMyAccountView.default(), {
				nav: 'my-account'
			});
		});
	}
});