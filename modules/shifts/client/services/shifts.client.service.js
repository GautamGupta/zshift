'use strict';

//Shifts service used for communicating with the shifts REST endpoints
angular.module('shifts').factory('Shifts', ['$resource',
	function($resource) {
		return $resource('api/shifts/:shiftId', {
			shiftId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
