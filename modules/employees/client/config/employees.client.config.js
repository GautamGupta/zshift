'use strict';

// Configuring the Employees module
angular.module('employees').run(['Menus',
	function(Menus) {
		// Add the employees dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Employees',
			state: 'employees',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'employees', {
			title: 'List Employees',
			state: 'employees.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'employees', {
			title: 'Add Employees',
			state: 'employees.create'
		});
	}
]);
