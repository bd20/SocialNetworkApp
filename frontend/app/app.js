;(function() {
'use strict'

angular.module('dummy', ['ngRoute', 'ngResource'])
	.config(config)
	;

function config($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl: 'app/login/login.html',
		controller: 'LoginControler as vm'
	})
		.when('/main', {
		templateUrl: 'app/main.html',
		controller: 'MainPageCtl as vm'
	})
		.when('/profile', {
		templateUrl: 'app/profile/profile.html',
		controller: 'ProfileController as vm'
	})
		.otherwise({
		redirectTo: '/main'
	})
}	
})()