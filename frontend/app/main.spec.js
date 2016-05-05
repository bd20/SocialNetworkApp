describe('Validate MainPageCtl functionality', function () {
	var ctrl;
	var mockServices
	beforeEach(module('dummy'))

	beforeEach(inject(function($controller, $rootScope,$q) { 
		mockServices =  jasmine.mockServices 
		mockServices.init($q)
	  	ctrl = $controller('MainPageCtl', {
			'ApiService': mockServices.mockApiService,
			'UserService': mockServices.mockUserService
		})
		ctrl._resolveTestPromises = function() {
			mockServices.resolveTestPromises($rootScope)
		}
		ctrl._resolveTestPromises()  
	}))

	//Unit test for logging out a user
	it('Unit test for logging out a user', function() {
		ctrl.logout();
		mockServices.mockUserService.login = true;
		ctrl._resolveTestPromises()
		expect(mockServices.mockUserService.login).toBe(false);
	  	
	})
})