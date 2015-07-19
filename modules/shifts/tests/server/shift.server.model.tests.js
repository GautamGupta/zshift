'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Shift = mongoose.model('Shift');

/**
 * Globals
 */
var user, shift;

/**
 * Unit tests
 */
describe('Shift Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			password: 'password'
		});

		user.save(function() {
			shift = new Shift({
				title: 'Shift Title',
				content: 'Shift Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return shift.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			shift.title = '';

			return shift.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Shift.remove().exec();
		User.remove().exec();
		done();
	});
});
