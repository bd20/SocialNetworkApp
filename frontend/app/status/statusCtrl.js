;(function() {	
	angular
		.module('dummy')
		.controller('StatusController',StatusController);
	
	StatusController.$inject = ['ApiService','UserService'];
	function StatusController(ApiService,UserService){
		var vm = this;
		vm.userName = "";
		vm.status = "";
		vm.avatar = "";
	
		vm.getInfo=function(){
			ApiService.getStatus().$promise.then(function(result) {
				var status = result.statuses[0];
				vm.userName = status.username;
				vm.status = status.status;
				ApiService.getPicture({user:vm.userName}).$promise.then(function(result){
					vm.avatar = result.picture;
					UserService.userName = vm.userName;
					UserService.userAvatar = vm.avatar;
					UserService.followerAvatars[vm.userName] = vm.avatar;
				})
			})
		}
		vm.getInfo();

		vm.editStatus=function(){
			ApiService.putStatus({status:vm.newStatus}).$promise.then(function(result){
				vm.status = result.status;
			});	
		}
	}
})();
