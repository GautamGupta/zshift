'use strict';

// Setting up route
angular.module('employees').config(['$stateProvider',
	function($stateProvider) {
		// Employees state routing
		$stateProvider.
		state('employees', {
			abstract: true,
			url: '/employees',
			template: '<ui-view/>'
		}).
		state('employees.list', {
			url: '',
			templateUrl: 'modules/employees/views/list-employees.client.view.html'
		}).
		state('employees.create', {
			url: '/create',
			templateUrl: 'modules/employees/views/create-employee.client.view.html'
		}).
		state('employees.view', {
			url: '/:employeeId',
			templateUrl: 'modules/employees/views/view-employee.client.view.html'
		}).
		state('employees.edit', {
			url: '/:employeeId/edit',
			templateUrl: 'modules/employees/views/edit-employee.client.view.html'
		});
	}
]);
