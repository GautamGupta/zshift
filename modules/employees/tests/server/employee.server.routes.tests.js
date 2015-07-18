'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Employee = mongoose.model('Employee'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, employee;

/**
 * Employee routes tests
 */
describe('Employee CRUD tests', function() {
	before(function(done) {
		// Get application
		app = express.init(mongoose);
		agent = request.agent(app);

		done();
	});

	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			email: 'email',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: credentials.email,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new employee
		user.save(function() {
			employee = {
				title: 'Employee Title',
				content: 'Employee Content'
			};

			done();
		});
	});

	it('should be able to save an employee if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new employee
				agent.post('/api/employees')
					.send(employee)
					.expect(200)
					.end(function(employeeSaveErr, employeeSaveRes) {
						// Handle employee save error
						if (employeeSaveErr) done(employeeSaveErr);

						// Get a list of employees
						agent.get('/api/employees')
							.end(function(employeesGetErr, employeesGetRes) {
								// Handle employee save error
								if (employeesGetErr) done(employeesGetErr);

								// Get employees list
								var employees = employeesGetRes.body;

								// Set assertions
								(employees[0].user._id).should.equal(userId);
								(employees[0].title).should.match('Employee Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an employee if not logged in', function(done) {
		agent.post('/api/employees')
			.send(employee)
			.expect(403)
			.end(function(employeeSaveErr, employeeSaveRes) {
				// Call the assertion callback
				done(employeeSaveErr);
			});
	});

	it('should not be able to save an employee if no title is provided', function(done) {
		// Invalidate title field
		employee.title = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new employee
				agent.post('/api/employees')
					.send(employee)
					.expect(400)
					.end(function(employeeSaveErr, employeeSaveRes) {
						// Set message assertion
						(employeeSaveRes.body.message).should.match('Title cannot be blank');

						// Handle employee save error
						done(employeeSaveErr);
					});
			});
	});

	it('should be able to update an employee if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new employee
				agent.post('/api/employees')
					.send(employee)
					.expect(200)
					.end(function(employeeSaveErr, employeeSaveRes) {
						// Handle employee save error
						if (employeeSaveErr) done(employeeSaveErr);

						// Update employee title
						employee.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing employee
						agent.put('/api/employees/' + employeeSaveRes.body._id)
							.send(employee)
							.expect(200)
							.end(function(employeeUpdateErr, employeeUpdateRes) {
								// Handle employee update error
								if (employeeUpdateErr) done(employeeUpdateErr);

								// Set assertions
								(employeeUpdateRes.body._id).should.equal(employeeSaveRes.body._id);
								(employeeUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of employees if not signed in', function(done) {
		// Create new employee model instance
		var employeeObj = new Employee(employee);

		// Save the employee
		employeeObj.save(function() {
			// Request employees
			request(app).get('/api/employees')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single employee if not signed in', function(done) {
		// Create new employee model instance
		var employeeObj = new Employee(employee);

		// Save the employee
		employeeObj.save(function() {
			request(app).get('/api/employees/' + employeeObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', employee.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an employee if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new employee
				agent.post('/api/employees')
					.send(employee)
					.expect(200)
					.end(function(employeeSaveErr, employeeSaveRes) {
						// Handle employee save error
						if (employeeSaveErr) done(employeeSaveErr);

						// Delete an existing employee
						agent.delete('/api/employees/' + employeeSaveRes.body._id)
							.send(employee)
							.expect(200)
							.end(function(employeeDeleteErr, employeeDeleteRes) {
								// Handle employee error error
								if (employeeDeleteErr) done(employeeDeleteErr);

								// Set assertions
								(employeeDeleteRes.body._id).should.equal(employeeSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an employee if not signed in', function(done) {
		// Set employee user
		employee.user = user;

		// Create new employee model instance
		var employeeObj = new Employee(employee);

		// Save the employee
		employeeObj.save(function() {
			// Try deleting employee
			request(app).delete('/api/employees/' + employeeObj._id)
			.expect(403)
			.end(function(employeeDeleteErr, employeeDeleteRes) {
				// Set message assertion
				(employeeDeleteRes.body.message).should.match('User is not authorized');

				// Handle employee error error
				done(employeeDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Employee.remove().exec();
		done();
	});
});
