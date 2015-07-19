'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Employee Schema
 */
var EmployeeSchema = new Schema({
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

	name: {
		type: String,
		default: '',
		trim: true,
		required: 'Name cannot be blank'
	},
	email: {
		type: String,
		trim: true,
		default: '',
		required: true,
		match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		unique: 'Email should be unique'
	},
	phone: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	wage: {
		type: Number,
		default: 0
	},
});

mongoose.model('Employee', EmployeeSchema);
