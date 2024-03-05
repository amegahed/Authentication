/******************************************************************************\
|                                                                              |
|                                  application.js                              |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level view of the application.                   |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import Router from './router.js';
import Session from './models/users/session.js';
import MainView from './views/layout/main-view.js';
import DialogView from './views/dialogs/dialog-view.js';
import ErrorDialogView from './views/dialogs/error-dialog-view.js';
import TimeUtils from './utilities/time/time-utils.js';
import DateUtils from './utilities/time/date-utils.js';
import Browser from './utilities/web/browser.js';
import './utilities/time/date-format.js';
import './utilities/scripting/string-utils.js';
import './utilities/scripting/array-utils.js';
import './utilities/web/html-utils.js';

export default Marionette.Application.extend({

	//
	// attributes
	//

	region: 'body',

	//
	// constructor
	//

	initialize: function() {

		// create new session
		//
		this.session = new Session();

		// in the event of a javascript error, reset the pending ajax spinner
		//
		$(window).on('error', function() {
			if ($.active > 0) {
				$.active = 0;
				$.event.trigger('ajaxStop');
			}
		});

		// ensure all cookie information is forwarded by default and watch for expired or fraudluent sessions
		//
		$.ajaxSetup({
			xhrFields: {
				withCredentials: true
			}
		});

		// log the user out if their session is found to be invalid
		//
		$(document).ajaxError((event, jqXHR) => {
			if (jqXHR.responseText === 'SESSION_INVALID') {
				this.error({
					message: "Sorry, your session has expired, please log in again.",
					
					// callbacks
					//
					accept: () => {
						application.session.logout({

							// callbacks
							// 
							success: () => {

								// go to welcome view
								//
								Backbone.history.navigate("#", {
									trigger: true
								});
							}
						});
					}
				});
			}
		});

		// set ajax calls to display wait cursor while pending
		//
		$(document).ajaxStart(() => {
			$('html').attr('style', 'cursor: wait !important;');
			$(document).trigger( $.Event('mousemove') );
		}).ajaxStop(() => {
			if ($.active < 1) {
				$('html').attr('style', 'cursor: default');
				$(document).trigger( $.Event('mousemove') );
			}
		});

		// store handle to application
		//
		window.application = this;

		// create routers
		//
		this.router = new Router();
	},

	getURL: function() {
		let protocol = window.location.protocol;
		let hostname = window.location.host;
		let pathname = window.location.pathname;
		return protocol + '//' + hostname + pathname;
	},

	//
	// startup methods
	//

	start: function() {

		// call superclass method
		//
		Marionette.Application.prototype.start.call(this);

		// call initializer
		//
		this.initialize();

		// check to see if user is logged in
		//
		this.relogin();
	},

	relogin: function() {

		// get previously logged in user
		//
		this.session.getUser({

			// callbacks
			//
			success: (user) => {
				this.session.user = user;
				Backbone.history.start();
			},

			error: () => {

				// session has expired
				//
				this.session.user = null;
				Backbone.history.start();
			}
		});
	},

	logout: function() {

		// end session
		//
		this.session.logout({

			// callbacks
			//
			success: () => {
				this.update();

				// go to welcome view
				//
				Backbone.history.navigate('#', {
					trigger: true
				});
			},
			
			error: (jqxhr, textstatus, errorThrown) => {

				// show error dialog
				//
				this.error({
					message: "Could not log out: " + errorThrown + "."
				});
			}
		});
	},

	//
	// rendering methods
	//

	show: function(view, options) {
		if (view instanceof DialogView) {

			// show modal dialog
			//
			view.show(options);
		} else {

			// show main view
			//
			this.showView(new MainView({
				contentView: view
			}));
		}
	},

	update: function() {

		// update header
		//
		if (this.getView('body').getChildView('header').currentView) {
			this.getView('body').getChildView('header').currentView.render();
		}
	},

	//
	// dialog rendering methods
	//

	error: function(options) {
		import(
			'./views/dialogs/error-dialog-view.js'
		).then((ErrorDialogView) => {

			// show error dialog
			//
			this.show(new ErrorDialogView.default(options));
		});
	},

	notify: function(options) {
		import(
			'./views/dialogs/notify-dialog-view.js'
		).then((NotifyDialogView) => {

			// show notify dialog
			//
			this.show(new NotifyDialogView.default(options));
		});
	},

	confirm: function(options) {
		import(
			'./views/dialogs/confirm-dialog-view.js'
		).then((ConfirmDialogView) => {

			// show confirm dialog
			//
			this.show(new ConfirmDialogView.default(options));
		});
	},
});