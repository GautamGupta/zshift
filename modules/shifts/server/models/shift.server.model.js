'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Shift Schema
 */
var ShiftSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},

	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},

	// Manager enters in
	employee: {
		type: Schema.ObjectId,
		ref: 'Employee'
	},
	startTime: {
		type: Date
	},
	endTime: {
		type: Date
	},

	// Employee enters in
	startedAt: {
		type: Date
	},
	endedAt: {
		type: Date
	},
	imageURL: {
		type: String
	}
});

mongoose.model('Shift', ShiftSchema);
