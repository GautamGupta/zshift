'use strict';

// Setting up route
angular.module('shifts').config(['$stateProvider',
	function($stateProvider) {
		// Shifts state routing
		$stateProvider.
		state('shifts', {
			abstract: true,
			url: '/shifts',
			template: '<ui-view/>'
		}).
		state('shifts.list', {
			url: '',
			templateUrl: 'modules/shifts/views/list-shifts.client.view.html'
		}).
		state('shifts.create', {
			url: '/create',
			templateUrl: 'modules/shifts/views/create-shift.client.view.html'
		}).
		state('shifts.view', {
			url: '/:shiftId',
			templateUrl: 'modules/shifts/views/view-shift.client.view.html'
		}).
		state('shifts.edit', {
			url: '/:shiftId/edit',
			templateUrl: 'modules/shifts/views/edit-shift.client.view.html'
		});
	}
]);
