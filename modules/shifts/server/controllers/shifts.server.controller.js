'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
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

	shift.title = req.body.title;
	shift.content = req.body.content;

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
