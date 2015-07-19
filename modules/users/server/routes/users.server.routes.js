'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../controllers/users.server.controller');

	// Setting up the users profile api
	app.route('/api/users/me').get(users.me);
    app.route('/api/users').put(users.update);
    app.route('/api/users/initiatePayment').post(users.initiatePayment);

	// Finish by binding the user middleware
	app.param('userId', users.userByID);
};
