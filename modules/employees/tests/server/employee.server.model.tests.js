'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Employee = mongoose.model('Employee');

/**
 * Globals
 */
var user, employee;

/**
 * Unit tests
 */
describe('Employee Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			password: 'password'
		});

		user.save(function() {
			employee = new Employee({
				title: 'Employee Title',
				content: 'Employee Content',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return employee.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without title', function(done) {
			employee.title = '';

			return employee.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) {
		Employee.remove().exec();
		User.remove().exec();
		done();
	});
});
