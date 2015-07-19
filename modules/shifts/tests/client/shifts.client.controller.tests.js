'use strict';

(function() {
	// Shifts Controller Spec
	describe('ShiftsController', function() {
		// Initialize global variables
		var ShiftsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Shifts controller.
			ShiftsController = $controller('ShiftsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one shift object fetched from XHR', inject(function(Shifts) {
			// Create sample shift using the Shifts service
			var sampleShift = new Shifts({
				title: 'An Shift about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample shifts array that includes the new shift
			var sampleShifts = [sampleShift];

			// Set GET response
			$httpBackend.expectGET('api/shifts').respond(sampleShifts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shifts).toEqualData(sampleShifts);
		}));

		it('$scope.findOne() should create an array with one shift object fetched from XHR using a shiftId URL parameter', inject(function(Shifts) {
			// Define a sample shift object
			var sampleShift = new Shifts({
				title: 'An Shift about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.shiftId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/shifts\/([0-9a-fA-F]{24})$/).respond(sampleShift);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.shift).toEqualData(sampleShift);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Shifts) {
			// Create a sample shift object
			var sampleShiftPostData = new Shifts({
				title: 'An Shift about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample shift response
			var sampleShiftResponse = new Shifts({
				_id: '525cf20451979dea2c000001',
				title: 'An Shift about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Shift about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('api/shifts', sampleShiftPostData).respond(sampleShiftResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the shift was created
			expect($location.path()).toBe('/shifts/' + sampleShiftResponse._id);
		}));

		it('$scope.update() should update a valid shift', inject(function(Shifts) {
			// Define a sample shift put data
			var sampleShiftPutData = new Shifts({
				_id: '525cf20451979dea2c000001',
				title: 'An Shift about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock shift in scope
			scope.shift = sampleShiftPutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/shifts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/shifts/' + sampleShiftPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid shiftId and remove the shift from the scope', inject(function(Shifts) {
			// Create new shift object
			var sampleShift = new Shifts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new shifts array and include the shift
			scope.shifts = [sampleShift];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/shifts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleShift);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.shifts.length).toBe(0);
		}));
	});
}());
