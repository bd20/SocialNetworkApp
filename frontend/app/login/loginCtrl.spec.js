describe('Validate LoginControler functionality', function () {
	var ctrl;
	var mockServices
	var $timeout
	
	beforeEach(module('dummy'))
	beforeEach(inject(function($controller, $rootScope,$q) {
		mockServices =  jasmine.mockServices
		mockServices.init($q)
	  	ctrl = $controller('LoginControler', {
			'ApiService': mockServices.mockApiService,
			'UserService': mockServices.mockUserService,
		})
		ctrl._resolveTestPromises = function() {
			mockServices.resolveTestPromises($rootScope)
		} 
	}))
	beforeEach(function(){
		ctrl._resolveTestPromises()
	})

	//Unit test for logging in a valid user
	it('Unit test for logging in a valid user', function() {
		$.fn.modal = function(){};
  		spyOn($.fn, 'modal');
		mockServices.mockUserService.login = false;
		ctrl.loginUsername = "bd20";
		ctrl.loginPassword = "12345678";
		ctrl.login();
		ctrl._resolveTestPromises();
		expect(mockServices.mockUserService.login).toBe(true);
	})

	//Unit test for invalid login
	it('Unit test for invalid login', function() {
		mockServices.mockUserService.login = false;
		ctrl.loginUsername = "";
		ctrl.loginPassword = "";
		ctrl.login();
		ctrl._resolveTestPromises()
		expect(mockServices.mockUserService.login).toBe(false);
	})	
});
