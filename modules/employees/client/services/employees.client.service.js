'use strict';

//Employees service used for communicating with the employees REST endpoints
angular.module('employees').factory('Employees', ['$resource',
	function($resource) {
		return $resource('api/employees/:employeeId', {
			employeeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
