describe('Validate PostController functionality', function () {
	var ctrl;

	beforeEach(module('dummy'))

	beforeEach(inject(function($controller, $rootScope,$q) {
		var mockServices =  jasmine.mockServices
		mockServices.init($q)
	  	ctrl = $controller('PostController', {
			'ApiService': mockServices.mockApiService,
			'UserService': mockServices.mockUserService
		})
		ctrl._resolveTestPromises = function() {
			mockServices.resolveTestPromises($rootScope)
		}
	}))
	beforeEach(function(){
		ctrl._resolveTestPromises()
	})

	//Unit test of the post filter
	it('Unit test of the post filter',inject(function($filter){
		//Filtered Author
		var post = [{author:'bd20', date:'2016-01-16T17:08:16.383Z', body:'canbeFilted'}];
		var query = 'bd20';
		var result =$filter('compare')(post,query);
		expect(result.length).toBe(1);

		//Filtered Body
		post = [{author:'bd20', date:'2016-01-16T17:08:16.383Z', body:'canbeFilted'}];
		var query = 'canbeFilted';
		var result =$filter('compare')(post,query);
		expect(result.length).toBe(1);
	}))

	//Unit test for adding a new post
	it('Unit test for adding a new post', function() {
		ctrl.postContent = "New Post";
		ctrl.addPost();
		ctrl._resolveTestPromises()
		expect(ctrl.posts.length).toBe(3);
		expect(ctrl.posts[0].body).toBe("New Post");
	})

	//Unit test for editing a post
	it('Unit test for editing a post',function(){
		expect(ctrl.posts[0].body).toBe("post body")
		ctrl.editPost(316455,0);
		ctrl._resolveTestPromises()
		expect(ctrl.posts[0].body).toBe("the new content")
	})

	//Unit test for commenting on a post
	it('Unit test for commenting on a post',function(){
		ctrl.newComment[0]="a new comment"
		ctrl.addComment(0);
		ctrl._resolveTestPromises()
		expect(ctrl.posts[0].comments[2].body).toBe("a new comment")
	})

	//Unit test for editing a comment
	it('Unit test for editing a comment',function(){
		ctrl.editComment(316455,1634135,"bd20",0);
		ctrl._resolveTestPromises()
		expect(ctrl.posts[0].comments[0].body).toBe("the new content")
	})
	beforeEach(function(){
		spyOn(window, "prompt").and.returnValue("the new content");
	})
});
