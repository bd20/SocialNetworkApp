;(function() {
	angular
		.module('dummy')
		.controller('PostController',PostController);
	
	PostController.$inject = ['ApiService','UserService'];
	function PostController(ApiService, UserService){
		var vm = this;
		vm.posts = [];
		vm.userName = "";
		vm.avatar = "";
		vm.postContent = "";

		ApiService.getStatus().$promise.then(function(result) {
			var status = result.statuses[0];		
			vm.userName = status.username;
		})

		//Load all the posts first
		vm.loadPosts = function(){
			ApiService.getPosts().$promise.then(function(result) {
				vm.posts = result.posts;
			})
		}
		vm.loadPosts();

		//Pass the file to new image
		vm.setFile = function(file){
			vm.newImage = file.files[0];
		}

		//Add a post
		vm.addPost = function(){
			//if nothing input, then return.
			if((vm.postContent==""|| !vm.postContent)&& !vm.newImage ){
				return;
			}
			ApiService.upload({ body: vm.postContent, img: vm.newImage})
			.$promise.then(function(result) {
				vm.posts.splice(0,0,result.posts[0]);
			});

		}

		//Edit the post
		vm.editPost = function(postId, $index){
			var newContent = prompt("New post:",
					vm.posts[$index].body);
				if (newContent != null){
					ApiService.newComment({id:postId,body:newContent})
						.$promise.then(function(result){
							vm.posts[$index].body= result.posts[0].body;
						})
				}
		}

		//Add a comment
		vm.newComment = [];
		vm.addComment = function($index){
			if(!vm.newComment[$index] || vm.newComment[$index] == ""){
				return;
			}
			var aPost = vm.posts[$index];
			ApiService.newComment(
				{id:vm.posts[$index]._id,
				body:vm.newComment[$index],
				commentId:'-1'})
				.$promise.then(function(result){
					vm.posts[$index].comments = result.posts[0].comments;
				})
			vm.newComment[$index] = "";
		}

		//Edit the Comment
		vm.editComment = function(postId, commentId,author,index){
			if(author == vm.userName){
				var newComment = prompt("New comment:");
				if (newComment != null){
					ApiService.newComment({id:postId,
						body:newComment,
						commentId:commentId})
						.$promise.then(function(result){
							vm.posts[index].comments = result.posts[0].comments;
						})
				}
			}
		}
	}

	angular.module('dummy').filter("compare",function(){
		return function(posts,query){
			var list = [];
			for (var i = 0; i < posts.length; i++)
			{
				var post = posts[i];
				//if(angular.lowercase(post.author).indexOf(angular.lowercase(query) || '') !== -1 ||angular.lowercase(post.body).indexOf(angular.lowercase(query) || '') !== -1)
				//{
					list.push(post);
				//}
			}
			return list;
		}
	});

})();
