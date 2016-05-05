;(function() {
	angular
		.module('dummy')
		.controller('MainPageCtl', MainPageCtl);
	
	MainPageCtl.$inject = ['ApiService','UserService'];
	function MainPageCtl(ApiService,UserService){
		var vm = this;
		vm.logout=function() {
			ApiService.logout().$promise.then(function(result) {
				UserService.updateStatus(true);
			})
		}
	    UserService.updateStatus(true);
	}
})();



