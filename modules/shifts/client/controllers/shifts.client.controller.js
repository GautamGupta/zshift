'use strict';

angular.module('shifts').controller('ShiftsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Shifts', 'Employees',
	function($scope, $stateParams, $location, Authentication, Shifts, Employees) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var shift = new Shifts({
				employee: this.employee,
				startTime: this.startTime,
				endTime: this.endTime,
			});
			shift.$save(function(response) {
				$location.path('shifts/' + response._id);

				$scope.employee = '';
				$scope.startTime = '';
				$scope.endTime = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(shift) {
			if (shift) {
				shift.$remove();

				for (var i in $scope.shifts) {
					if ($scope.shifts[i] === shift) {
						$scope.shifts.splice(i, 1);
					}
				}
			} else {
				$scope.shift.$remove(function() {
					$location.path('shifts');
				});
			}
		};

		$scope.update = function() {
			var shift = $scope.shift;

			shift.$update(function() {
				$location.path('shifts/' + shift._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.shifts = Shifts.query();
		};

		$scope.findOne = function() {
			$scope.shift = Shifts.get({
				shiftId: $stateParams.shiftId
			});
		};

		$scope.findEmployees = function() {
			$scope.employees = Employees.query();
		}
	}
]);
