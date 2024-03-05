/******************************************************************************\
|                                                                              |
|                                   session.js                                 |
|                                                                              |
|******************************************************************************|
|                                                                              |
|        This defines the top level application specific class.                |
|                                                                              |
|******************************************************************************|
|     Copyright (C) 2022, Data Science Institute, University of Wisconsin      |
\******************************************************************************/

import User from '../../models/users/user.js';

export default Backbone.Model.extend({

	//
	// login / begin session methods
	//

	login: function(username, password, options) {

		// initialize the session
		//
		$.ajax(config.server + '/login', _.extend(options, {
			type:'POST',
			dataType:'json',
			data: {
				'username': username,
				'password': password
			}
		}));
	},

	isLoggedIn: function() {
		return this.user ? true : false;
	},

	//
	// querying methods
	//

	getUser: function(options) {

		// create new user
		//
		this.user = new User({
			user_uid: 'current'
		});

		// fetch the user using the rws server session
		//
		this.user.fetch({

			// callbacks
			//
			success: () => {

				// fetch the user using the csa server session
				//
				let user = new User({
					user_uid: 'current'
				});

				user.fetch({
					url: config.server + '/users/current',

					// callbacks
					//
					success: () => {
						if (options.success) {
							options.success(this.user);
						}
					},

					error: (response, statusText, errorThrown) => {
						if (options.error) {
							options.error(response, statusText, errorThrown);
						}
					}
				});
			},

			error: (response, statusText, errorThrown) => {
				if (options.error) {
					options.error(response, statusText, errorThrown);
				}
			}
		});
	},

	//
	// logout / end session methods
	//

	logout: function(options) {

		// delete local user info
		//
		this.user = null;

		// log out from server
		//
		$.ajax(config.server + '/logout', _.extend(options, {
			type: 'POST'
		}));
	}
});