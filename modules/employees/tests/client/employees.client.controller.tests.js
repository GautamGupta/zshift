'use strict';

(function() {
	// Employees Controller Spec
	describe('EmployeesController', function() {
		// Initialize global variables
		var EmployeesController,
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

			// Initialize the Employees controller.
			EmployeesController = $controller('EmployeesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one employee object fetched from XHR', inject(function(Employees) {
			// Create sample employee using the Employees service
			var sampleEmployee = new Employees({
				title: 'An Employee about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample employees array that includes the new employee
			var sampleEmployees = [sampleEmployee];

			// Set GET response
			$httpBackend.expectGET('api/employees').respond(sampleEmployees);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employees).toEqualData(sampleEmployees);
		}));

		it('$scope.findOne() should create an array with one employee object fetched from XHR using a employeeId URL parameter', inject(function(Employees) {
			// Define a sample employee object
			var sampleEmployee = new Employees({
				title: 'An Employee about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.employeeId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/api\/employees\/([0-9a-fA-F]{24})$/).respond(sampleEmployee);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.employee).toEqualData(sampleEmployee);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Employees) {
			// Create a sample employee object
			var sampleEmployeePostData = new Employees({
				title: 'An Employee about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample employee response
			var sampleEmployeeResponse = new Employees({
				_id: '525cf20451979dea2c000001',
				title: 'An Employee about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Employee about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('api/employees', sampleEmployeePostData).respond(sampleEmployeeResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the employee was created
			expect($location.path()).toBe('/employees/' + sampleEmployeeResponse._id);
		}));

		it('$scope.update() should update a valid employee', inject(function(Employees) {
			// Define a sample employee put data
			var sampleEmployeePutData = new Employees({
				_id: '525cf20451979dea2c000001',
				title: 'An Employee about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock employee in scope
			scope.employee = sampleEmployeePutData;

			// Set PUT response
			$httpBackend.expectPUT(/api\/employees\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/employees/' + sampleEmployeePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid employeeId and remove the employee from the scope', inject(function(Employees) {
			// Create new employee object
			var sampleEmployee = new Employees({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new employees array and include the employee
			scope.employees = [sampleEmployee];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/api\/employees\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleEmployee);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.employees.length).toBe(0);
		}));
	});
}());
