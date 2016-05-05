;(function() {
	'use strict'

    angular.module('dummy')
        .controller('LoginControler',LoginControler);
        
    LoginControler.$inject = ['ApiService','$location','$timeout','UserService'];
    function LoginControler(ApiService, $location,$timeout, UserService){
        var vm = this;
        vm.errMessage = '';
        vm.notValid = false;
        vm.posts = [];
        vm.errMessage = '';

        vm.login = function(){
            if(!vm.loginUsername || vm.loginUsername==""){
                vm.notValid = true;
            }
            else {
                vm.notValid = false;
            }

            if(!vm.notValid){
                ApiService.login({'username':vm.loginUsername, 'password':vm.loginPassword})
                .$promise.then(function(result) {
                    UserService.updateStatus(false);
                })
            }
        }
        vm.register = function(){
            if(vm.registerCheck()){
                ApiService.register({username: vm.regname, 
                    email:vm.email, 
                    zipcode:vm.zipcode, 
                    password:vm.password}).$promise.then(function(result) {
                       alert("Successfully Registered");
                    })
            }
        }
        vm.registerCheck = function(){
            vm.checkZipcode(vm);
            vm.checkEmail(vm);
            vm.checkPassword(vm);
            vm.checkConfPassword(vm);
            return !vm.zipcodeErr && !vm.emailErr && !vm.passwordErr 
                && !vm.cpasswordErr;
        }

        vm.zipcodeErr = false;
        vm.checkZipcode = UserService.checkZipcode;
        vm.emailErr = false;
        vm.checkEmail = UserService.checkEmail;

        vm.passwordErr = false;
        vm.checkPassword = UserService.checkPassword;

        vm.cpasswordErr = false;
        vm.checkConfPassword = UserService.checkConfPassword;

        vm.loginUsernameErr = false;
        vm.checkUsername = UserService.checkUsername;
    }
})();


