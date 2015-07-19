'use strict';

/**
 * Module dependencies.
 */
var shiftsPolicy = require('../policies/shifts.server.policy'),
	shifts = require('../controllers/shifts.server.controller');

module.exports = function(app) {
	// Shifts collection routes
	app.route('/api/shifts').all(shiftsPolicy.isAllowed)
		.get(shifts.list)
		.post(shifts.create);

	// Single shift routes
	app.route('/api/shifts/:shiftId').all(shiftsPolicy.isAllowed)
		.get(shifts.read)
		.put(shifts.update)
		.delete(shifts.delete);

	// Finish by binding the shift middleware
	app.param('shiftId', shifts.shiftByID);
};
