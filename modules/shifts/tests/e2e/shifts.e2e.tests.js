'use strict';

describe('Shifts E2E Tests:', function() {
	describe('Test shifts page', function() {
		it('Should report missing credentials', function() {
			browser.get('http://localhost:3000/#!/shifts');
			expect(element.all(by.repeater('shift in shifts')).count()).toEqual(0);
		});
	});
});
