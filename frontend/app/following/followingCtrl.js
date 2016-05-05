;(function() {
	angular
		.module('dummy')
		.controller('FollowingController',FollowingController);

	FollowingController.$inject = ['ApiService','UserService'];
	function FollowingController(ApiService,UserService){
		var vm = this;
		vm.followings = [];
		vm.getFollowing = function(){
			ApiService.getFollowing().$promise.then(function(result) {
				ApiService.getStatuses({user:result.following})
				.$promise.then(function(response){
					vm.followings = response.statuses;
					angular.forEach(vm.followings, function(user,id){
 	  					updatePicture(id);
 	  				})
				})
			})
		}
		function updatePicture(id){
			if(!UserService.followerAvatars[vm.followings[id].username]){
				ApiService.getPicture({user:vm.followings[id].username})
				.$promise.then(function(result){
					vm.followings[id]['avatar'] = result.picture;
					UserService.setAvatar(vm.followings[id].username,result.picture);
				})
			}
			else{
				vm.followings[id]['avatar'] 
					= UserService.followerAvatars[vm.followings[id].username];
			}
		}
		vm.getFollowing();
		vm.addUser = function(){
			var count = vm.followings.length;
			ApiService.newFollowing({user:vm.newFollower})
			.$promise.then(function(result){
				if(result.following.length==count){
					if(result.username == vm.newFollower){
						vm.newFollowerMessage = "Cannot add yourself";
					}
					else{
						vm.newFollowerMessage = "No user found";
					}
				}
				else{
					var response = result.following;
					var theUsername = result.following.pop();
					ApiService.getStatuses({user:[theUsername]})
						.$promise.then(function(response){
							vm.followings.push(response.statuses[0]);
							updatePicture(vm.followings.length-1);
						})
					vm.newFollower = "";
					vm.newFollowerMessage = "";
				}
			})
		}
		vm.deleteUser = function($index){
			ApiService.removeFollowing({user:vm.followings[$index].username})
			.$promise.then(function(result){
				vm.followings.splice($index,1);
			})
		}
	}
})();