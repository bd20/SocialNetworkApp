;(function() {
	angular.module('dummy')
		.controller('ProfileController',ProfileController);

	ProfileController.$inject = ['ApiService','UserService','$window','serverURL'];
	function ProfileController(ApiService,UserService,$window,serverURL){
		var vm = this;
		vm.userName = UserService.userName;
		vm.email = "";
		vm.zipcode = "";
		vm.avatar = "";

		vm.logout=function() {
			ApiService.logout().$promise.then(function(result) {
				UserService.updateStatus(true);
			})
		}
		vm.uploadFile = function(file){
			vm.newImage = file.files[0];
			ApiService.uploadPicture({ img: vm.newImage }).$promise.then(function(result) {
				vm.avatar = result.picture;
				UserService.setAvatar(UserService.userName,vm.avatar);
			});

		}
		//Get Email from dummy server
		ApiService.getEmail({user:vm.userName}).$promise.then(function(result){
			vm.email = result.email;
		})
		//Get Zipcode from dummy server
		ApiService.getZipcode({user:vm.userName}).$promise.then(function(result){
			vm.zipcode = result.zipcode;
		})
		//Get Picture from dummy server
		ApiService.getPicture({user:vm.userName}).$promise.then(function(result){
			vm.avatar = result.picture;
		})
		
		vm.changeZipcode=function(){
			vm.checkZipcode(vm);
			if(!vm.zipcodeErr){
				ApiService.newZipcode({ zipcode: vm.zipcode}).$promise.then(function(result){
					vm.zipcode = result.zipcode;
					alert("zipcode modified to "+result.zipcode);
				},function(error){
					ApiService.getZipcode({user:vm.userName}).$promise.then(function(result){
						vm.zipcode = result.zipcode;
					})
					alert("failed");	
				})
			}
		}
		vm.changeEmail = function(){
			vm.checkEmail(vm);
			if(!vm.emailErr){
				ApiService.newEmail({email: vm.email}).$promise.then(function(result){
					vm.email = result.email;
					alert("email modified to "+result.email);
				},function(error){
					ApiService.getEmail({user:vm.userName}).$promise.then(function(result){
						vm.email = result.email;
					})
					alert("failed");
				})
			}
		}
		vm.changePassword = function(){
			vm.checkPassword(vm);
			vm.checkCPassword(vm);
			if(!(vm.passwordErr || vm.cpasswordErr)){
				ApiService.changePassword({password: vm.password}).$promise.then(function(result){
					alert(result.status);
				},function(error){
					alert("failed");
				})
			}
		}

		vm.linkLocal = function(){
			ApiService.linkLocal({'username':vm.linkUsername, 'password':vm.linkPassword})
			.$promise.then(function(result){
				$('#profile').modal('hide');
				alert("Successfully Link")
                var refresh = function(){
                    $location.path('main')
                }
                $timeout(refresh,500);

			},function(err){
				alert("Failed:"+err.data)
			})
		}
		vm.authLink = function(){
			alert("Go Auth at Facebook")
			vm.linkFacebook = "Unlink"
			$window.location.href = serverURL+'/auth/facebook';
		}
		vm.authUnLink = function(){
			ApiService.auth({},{id:"unlink"}).$promise.then(function(result){
				alert("Successfully Unlink")
				vm.linkFacebook = "Link"
			},function(err){
				alert("Failed:"+err.data)
			})
		}
		vm.zipcodeErr = false;
		vm.checkZipcode = UserService.checkZipcode;

		vm.emailErr = false;
		vm.checkEmail = UserService.checkEmail;

		vm.passwordErr = false;
		vm.checkPassword = UserService.checkPassword;

		vm.cpasswordErr = false;
		vm.checkCPassword = UserService.checkConfPassword;

		UserService.updateStatus(true);
	}
})()