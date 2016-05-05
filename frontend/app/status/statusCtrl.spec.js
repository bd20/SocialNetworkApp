describe('Validate StatusController functionality', function () {
	var ctrl;
	beforeEach(module('dummy'))
	beforeEach(inject(function($controller, $rootScope,$q) {
		var mockServices =  jasmine.mockServices
		mockServices.init($q)
	  	ctrl = $controller('StatusController', {
			'ApiService': mockServices.mockApiService,
			'UserService': mockServices.mockUserService
		})
		ctrl._resolveTestPromises = function() {
			mockServices.resolveTestPromises($rootScope)
		}
	}))
	beforeEach(function(){
		ctrl._resolveTestPromises()
	})

	//Unit test for updating status headline
	it('Updating status headline', function() {
		ctrl.newStatus = "a new status"
		ctrl.editStatus();
		ctrl._resolveTestPromises()
		expect(ctrl.status).toBe(ctrl.newStatus)
	})

});
