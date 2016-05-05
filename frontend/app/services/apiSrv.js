;(function() {
	'use strict'
	
	angular.module('dummy')
		.constant('serverURL','https://bd20-inclassbe.herokuapp.com');
 
		//https://bd20-inclassbe.herokuapp.com
		//http://localhost:3000

	angular.module('dummy')	
		.factory('ApiService', ApiService);

	function ApiService($http, $resource, serverURL) {
		$http.defaults.withCredentials = true
		function resourceUploadFile(data) {
			var fd = new FormData()  
			fd.append('image', data.img)
			fd.append('body', data.body)
			return fd;
		}
		return $resource(serverURL + '/:endpoint/:id/:user', {user :'@user', id: '@id'},
		    {
		        login: { method:'POST', params: {endpoint: 'login'} },
		        logout   : { method:'PUT' , params: {endpoint: 'logout' } },
		        sample:{method:'GET', params:{endpoint: 'sample'} },
		        getStatus: { method:'GET' , params: {endpoint: 'status' } },
		        getStatuses: { method:'GET', params: {endpoint: 'statuses'}},
		        getPicture: { method: 'GET', params: {endpoint: 'picture'} },
		        putStatus: { method:'PUT', params: {endpoint: 'status'}},
		        getPosts:{method: 'GET', params:{endpoint: 'posts'}},
		       	newComment:{method:'PUT', params: {endpoint: 'posts'}},
		        newPost:{method:'POST', params: {endpoint: 'post'}},
		        upload: { method: 'POST', headers: { 'Content-Type': undefined },
		        			transformRequest: resourceUploadFile,
		        			params: {endpoint: 'post'}},
		        getFollowing: { method:'GET', params: {endpoint: 'following'}},
		        newFollowing: { method:'PUT', params: {endpoint: 'following'}},
		        removeFollowing: {method: 'DELETE', params: {endpoint: 'following'}},
		        newEmail:{method:'PUT', params: {endpoint: 'email'}},
		        getEmail:{method:'GET', params: {endpoint: 'email'}},
		        newZipcode:{method:'PUT', params: {endpoint: 'zipcode'}},
		        getZipcode:{method:'GET', params: {endpoint: 'zipcode'}},
		        changePassword:{method:'PUT', params: {endpoint: 'password'}},
		        uploadPicture: {method:'PUT', headers: { 'Content-Type': undefined },
		        			transformRequest: resourceUploadFile,
		        			params: {endpoint: 'picture'}},
		        register: { method:'POST', params: {endpoint: 'register'} },
		        auth:{method: 'GET', params:{endpoint:'auth'}},
		        linkLocal:{method: 'POST', params:{endpoint:'linklocal'}}
		    });
	}
})()