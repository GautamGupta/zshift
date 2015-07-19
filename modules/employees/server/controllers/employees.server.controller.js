'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Employee = mongoose.model('Employee'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a employee
 */
exports.create = function(req, res) {
	var employee = new Employee(req.body);
	employee.user = req.user;

	employee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(employee);
		}
	});
};

/**
 * Show the current employee
 */
exports.read = function(req, res) {
	res.json(req.employee);
};

/**
 * Update a employee
 */
exports.update = function(req, res) {
	var employee = req.employee;

	employee.name = req.body.name;
	employee.email = req.body.email;
	employee.phone = req.body.phone;
	employee.wage = req.body.wage;

	employee.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(employee);
		}
	});
};

/**
 * Delete an employee
 */
exports.delete = function(req, res) {
	var employee = req.employee;

	employee.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(employee);
		}
	});
};

/**
 * List of Employees
 */
exports.list = function(req, res) {
	Employee.find().sort('-name').exec(function(err, employees) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(employees);
		}
	});
};

/**
 * Employee middleware
 */
exports.employeeByID = function(req, res, next, id) {
	Employee.findById(id).exec(function(err, employee) {
		if (err) return next(err);
		if (!employee) return next(new Error('Failed to load employee ' + id));
		req.employee = employee;
		next();
	});
};
