'use strict';

angular.module('employees').controller('EmployeesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Employees',
	function($scope, $stateParams, $location, Authentication, Employees) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var employee = new Employees({
				name: this.name,
				email: this.email,
				phone: this.phone,
			});
			employee.$save(function(response) {
				$location.path('employees/' + response._id);

				$scope.name = '';
				$scope.email = '';
				$scope.phone = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(employee) {
			if (employee) {
				employee.$remove();

				for (var i in $scope.employees) {
					if ($scope.employees[i] === employee) {
						$scope.employees.splice(i, 1);
					}
				}
			} else {
				$scope.employee.$remove(function() {
					$location.path('employees');
				});
			}
		};

		$scope.update = function() {
			var employee = $scope.employee;

			employee.$update(function() {
				$location.path('employees/' + employee._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.employees = Employees.query();
		};

		$scope.findOne = function() {
			$scope.employee = Employees.get({
				employeeId: $stateParams.employeeId
			});
		};
	}
]);
