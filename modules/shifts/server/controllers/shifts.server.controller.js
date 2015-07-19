'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	fs = require('fs'),
	path = require('path'),
	mongoose = require('mongoose'),
	Shift = mongoose.model('Shift'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a shift
 */
exports.create = function(req, res) {
	var shift = new Shift(req.body);
	shift.user = req.user;

	shift.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var Employee = mongoose.model('Employee');

			var employee = Employee.findById(shift.employee);
			Employee.findById(shift.employee).exec(function(err, employee) {
				console.log(employee);

				if (employee && employee.phone) {
					// Load the twilio module
					var twilio = require('twilio');

					// Create a new REST API client to make authenticated requests against the
					// twilio back end
					var client = new twilio.RestClient('ACcdfbee31a29f6e78c9eeee13256b00ea', '9aa818daf8f733acec34bb6517fe058b');

					// Pass in parameters to the REST API using an object literal notation. The
					// REST client will handle authentication and response serialzation for you.
					client.sms.messages.create({
					    to: employee.phone,
					    from:'+16475591742',
					    body: 'You have a new shift from ' + shift.startTime + ' to ' + shift.endTime + '.'
					}, function(error, message) {
					    // The HTTP request to Twilio will run asynchronously. This callback
					    // function will be called when a response is received from Twilio
					    // The "error" variable will contain error information, if any.
					    // If the request was successful, this value will be "falsy"
					    if (!error) {
					        // The second argument to the callback will contain the information
					        // sent back by Twilio for the request. In this case, it is the
					        // information about the text messsage you just sent:
					        console.log('Success! The SID for this SMS message is:');
					        console.log(message.sid);

					        console.log('Message sent on:');
					        console.log(message.dateCreated);
					    } else {
					        console.log('Oops! There was a Twilio error. ' + err);
					    }
					});
				}
			});


			res.json(shift);
		}
	});
};

/**
 * Show the current shift
 */
exports.read = function(req, res) {
	res.json(req.shift);
};

/**
 * Update a shift
 */
exports.update = function(req, res) {
	var shift = req.shift;

	if (req.body.employee) shift.employee = req.body.employee;
	if (req.body.startTime) shift.startTime = req.body.startTime;
	if (req.body.endTime) shift.endTime = req.body.endTime;
	if (req.body.startedAt) shift.startedAt = req.body.startedAt;
	if (req.body.endedAt) shift.endedAt = req.body.endedAt;

	if (req.files) {
		fs.writeFile('./modules/shifts/client/img/logs/uploads/' + req.files.image.name, req.files.image.buffer, function (uploadError) {
			if (uploadError) {
				return res.status(400).send({
					message: 'Error occurred while uploading profile picture'
				});
			} else {
				shift.imageURL = 'modules/shifts/img/logs/uploads/' + req.files.image.name;

				shift.save(function(err) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						res.json(shift);
					}
				});
			}
		});
	} else {
		shift.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(shift);
			}
		});
	}
};

/**
 * Delete an shift
 */
exports.delete = function(req, res) {
	var shift = req.shift;

	shift.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(shift);
		}
	});
};

/**
 * List of Shifts
 */
exports.list = function(req, res) {
	var Employee = mongoose.model('Employee');

	Shift.find().sort('-created').populate('employee').exec(function(err, shifts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(shifts);
		}
	});
};

/**
 * Shift middleware
 */
exports.shiftByID = function(req, res, next, id) {
	Shift.findById(id).populate('employee').exec(function(err, shift) {
		if (err) return next(err);
		if (!shift) return next(new Error('Failed to load shift ' + id));
		req.shift = shift;
		next();
	});
};
