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
