;(function() {
	angular.module('dummy')	
		.service('UserService', UserService);

	function UserService(ApiService,$location){
		var service = this;
		service.followerAvatars = {};
		service.userAvatar = "";
		service.userName = "";

		//Redirect due to user's preference
		service.updateStatus = function(isMain) {
	          ApiService.getStatus().$promise.then(function(result) {
	              var status = result.statuses[0]
	              service.userName = status.username;
	              if(!isMain){
	              		$location.path('main');
	              }
	          }, function(error) {
	          	if(isMain){
	          		$location.path('login')
	          	}    
	          })
	     }
	     //set the avatar by seperating users or followers
	     service.setAvatar = function(user,avatar){
			if(user == service.userName){
				service.userAvatar = avatar;
			}
			service.followerAvatars[user] = avatar;
		}

		service.checkZipcode=function(vm){
			if(!vm.zipcode || vm.zipcode==""){
					vm.zipcodeErr = true;
					vm.zipcodeErrMessage = "Zipcode should not be blank.";
			}
			else{
				vm.zipcodeErr = false;
				var reg = /^\d{5}$/;   
	
				var r = vm.zipcode.toString().match(reg);
				if(r == null){
					vm.zipcodeErr = true;
					vm.zipcodeErrMessage = "Zipcode should be 5 digits."
				}
			}
		}
		service.checkEmail=function(vm){
			if(!vm.email || vm.email==""){
				vm.emailErr = true;
				vm.emailErrMessage = "E-mail should not be blank.";
	
			}
			else{
				vm.emailErr = false;
				var reg = /^[a-zA-Z0-9\._-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/; 
				var r = vm.email.toString().match(reg);
				if(r == null){
					vm.emailErr = true;
					vm.emailErrMessage = "Email address should be valid."
				}
			}
		}
		service.checkPassword = function(vm){
			if(!vm.password || vm.password==""){
				vm.passwordErr = true;
				vm.passwordErrMessage = "Password should not be blank.";
	
			}
			else{
				vm.passwordErr = false;	
			}
		}
		service.checkConfPassword = function(vm){
			if(!vm.cpassword || vm.cpassword!=vm.password){
				vm.cpasswordErr = true;
				vm.cpasswordErrMessage = "The passwords should be the same.";
			}
			else{
				vm.cpasswordErr = false;
			}
		}
		service.checkFirstName = function(vm){
			if(!vm.firstName || vm.firstName==""){
				vm.firstnameErr = true;
				vm.firstnameErrMessage = "First Name should not be blank";
			}
			else{
				vm.firstnameErr = false;
			}
		}
	
		service.checkLastName = function(vm){
			if(!vm.lastName || vm.lastName==""){
				vm.lastnameErr = true;
				vm.lastnameErrMessage = "Last Name should not be blank";
			}
			else{
				vm.lastnameErr = false;
			}
		}
	
		service.checkUsername = function(vm){
			if(!vm.loginUsername||vm.loginUsername==""){
				vm.loginUsernameErr = true;
				vm.usernameErrMessage = "User Name should not be blank";
			}
			else{
				vm.loginUsernameErr = false;
			}
		}
	}
})()


