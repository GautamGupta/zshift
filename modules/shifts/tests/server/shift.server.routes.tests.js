'use strict';

var should = require('should'),
	request = require('supertest'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Shift = mongoose.model('Shift'),
	express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, shift;

/**
 * Shift routes tests
 */
describe('Shift CRUD tests', function() {
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

		// Save a user to the test db and create new shift
		user.save(function() {
			shift = {
				title: 'Shift Title',
				content: 'Shift Content'
			};

			done();
		});
	});

	it('should be able to save an shift if logged in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new shift
				agent.post('/api/shifts')
					.send(shift)
					.expect(200)
					.end(function(shiftSaveErr, shiftSaveRes) {
						// Handle shift save error
						if (shiftSaveErr) done(shiftSaveErr);

						// Get a list of shifts
						agent.get('/api/shifts')
							.end(function(shiftsGetErr, shiftsGetRes) {
								// Handle shift save error
								if (shiftsGetErr) done(shiftsGetErr);

								// Get shifts list
								var shifts = shiftsGetRes.body;

								// Set assertions
								(shifts[0].user._id).should.equal(userId);
								(shifts[0].title).should.match('Shift Title');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save an shift if not logged in', function(done) {
		agent.post('/api/shifts')
			.send(shift)
			.expect(403)
			.end(function(shiftSaveErr, shiftSaveRes) {
				// Call the assertion callback
				done(shiftSaveErr);
			});
	});

	it('should not be able to save an shift if no title is provided', function(done) {
		// Invalidate title field
		shift.title = '';

		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new shift
				agent.post('/api/shifts')
					.send(shift)
					.expect(400)
					.end(function(shiftSaveErr, shiftSaveRes) {
						// Set message assertion
						(shiftSaveRes.body.message).should.match('Title cannot be blank');

						// Handle shift save error
						done(shiftSaveErr);
					});
			});
	});

	it('should be able to update an shift if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new shift
				agent.post('/api/shifts')
					.send(shift)
					.expect(200)
					.end(function(shiftSaveErr, shiftSaveRes) {
						// Handle shift save error
						if (shiftSaveErr) done(shiftSaveErr);

						// Update shift title
						shift.title = 'WHY YOU GOTTA BE SO MEAN?';

						// Update an existing shift
						agent.put('/api/shifts/' + shiftSaveRes.body._id)
							.send(shift)
							.expect(200)
							.end(function(shiftUpdateErr, shiftUpdateRes) {
								// Handle shift update error
								if (shiftUpdateErr) done(shiftUpdateErr);

								// Set assertions
								(shiftUpdateRes.body._id).should.equal(shiftSaveRes.body._id);
								(shiftUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of shifts if not signed in', function(done) {
		// Create new shift model instance
		var shiftObj = new Shift(shift);

		// Save the shift
		shiftObj.save(function() {
			// Request shifts
			request(app).get('/api/shifts')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single shift if not signed in', function(done) {
		// Create new shift model instance
		var shiftObj = new Shift(shift);

		// Save the shift
		shiftObj.save(function() {
			request(app).get('/api/shifts/' + shiftObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('title', shift.title);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete an shift if signed in', function(done) {
		agent.post('/api/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new shift
				agent.post('/api/shifts')
					.send(shift)
					.expect(200)
					.end(function(shiftSaveErr, shiftSaveRes) {
						// Handle shift save error
						if (shiftSaveErr) done(shiftSaveErr);

						// Delete an existing shift
						agent.delete('/api/shifts/' + shiftSaveRes.body._id)
							.send(shift)
							.expect(200)
							.end(function(shiftDeleteErr, shiftDeleteRes) {
								// Handle shift error error
								if (shiftDeleteErr) done(shiftDeleteErr);

								// Set assertions
								(shiftDeleteRes.body._id).should.equal(shiftSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete an shift if not signed in', function(done) {
		// Set shift user
		shift.user = user;

		// Create new shift model instance
		var shiftObj = new Shift(shift);

		// Save the shift
		shiftObj.save(function() {
			// Try deleting shift
			request(app).delete('/api/shifts/' + shiftObj._id)
			.expect(403)
			.end(function(shiftDeleteErr, shiftDeleteRes) {
				// Set message assertion
				(shiftDeleteRes.body.message).should.match('User is not authorized');

				// Handle shift error error
				done(shiftDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Shift.remove().exec();
		done();
	});
});
