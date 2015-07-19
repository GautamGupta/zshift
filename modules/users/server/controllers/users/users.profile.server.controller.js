'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	config = require(path.resolve('./config/config')),
	Paypal = require('paypal-adaptive');

var paypalSdk = new Paypal({
    userId:    'gautam+zs-facilitator_api1.gaut.am',
    password:  'WP4HCRXBEKP4FJ9P',
    signature: 'Ajql5sQinR2Fr0rVHuyIo6TzW94xA7FU7UiCcHaTfL6y99128IhyD89A',
    sandbox:   true // defaults to false
});

/**
 * Update user details
 */
exports.update = function (req, res) {
	// Init Variables
	var user = req.user;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function (err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function (err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
	var user = req.user;
	var message = null;

	if (user) {
		fs.writeFile('./modules/users/client/img/profile/uploads/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading profile picture'
				});
			} else {
				user.profileImageURL = 'modules/users/img/profile/uploads/' + req.files.file.name;

				user.save(function (saveError) {
					if (saveError) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(saveError)
						});
					} else {
						req.login(user, function (err) {
							if (err) {
								res.status(400).send(err);
							} else {
								res.json(user);
							}
						});
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Redirect to Paypal
 */
exports.initiatePayment = function (req, res) {
	var user = req.user;

	if (user) {
		var payload = {
		    currencyCode:                   'USD',
		    startingDate:                   new Date().toISOString(),
		    endingDate:                     new Date('2016-01-01').toISOString(),
		    returnUrl:                      'http://zshift.herokuapp.com/settings/payments/return',
		    cancelUrl:                      'http://zshift.herokuapp.com/settings/payments/',
		    maxTotalAmountOfAllPayments:    '1500.00',
		    requestEnvelope: {
		        errorLanguage:  'en_US'
		    }
		};

		paypalSdk.preapproval(payload, function (err, response) {
		    if (err) {
		        console.log(err);
		    } else {
		        // Response will have the original Paypal API response
		        console.log(response);
		        // But also a preapprovalUrl, so you can redirect the sender to approve the payment easily
		        console.log('Redirect to %s', response.preapprovalUrl);

		        user.paypalPreapprovalKey = res.preapprovalKey;

		        user.save(function (saveError) {
					if (saveError) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(saveError)
						});
					} else {
						res.redirect(response.preapprovalUrl);
					}
				});
		    }
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/**
 * Send User
 */
exports.me = function (req, res) {
	res.json(req.user || null);
};
