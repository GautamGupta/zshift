'use strict';

// Configuring the Shifts module
angular.module('shifts').run(['Menus',
	function(Menus) {
		// Add the shifts dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Shifts',
			state: 'shifts',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'shifts', {
			title: 'List Shifts',
			state: 'shifts.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'shifts', {
			title: 'Add Shift',
			state: 'shifts.create'
		});
	}
]);
