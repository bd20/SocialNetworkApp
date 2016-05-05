(function(jasmine) { 	
	var $q
	var promises = []

	function init(_$q_) {
		$q = _$q_
	}

	function makePromise(response,accept) {
		var p = $q.defer()
		promises.push({ promise: p, response: response, accept:accept })
		return { $promise: p.promise }
	}

	var mockApiService =  {
		haveLoggedIn: true,
		getPicture: function(params) {
			if(params.user == "bd20"){
				return makePromise(
					{
						"username":"bd20",
						"picture":"https://randomuser.me/api/portraits/thumb/men/25.jpg"
					}
				,true)
			}
			if(params.user == "bd20test"){
				return makePromise(
					{
						"username":"bd20test",
						"picture":"https://randomuser.me/api/portraits/thumb/men/25.jpg"
					},true
				)
			}
			if(params.user == "sep1"){
				return makePromise(
					{
						"username":"sep1",
						"picture":"https://randomuser.me/api/portraits/thumb/men/20.jpg"
					}
				,true)
			}
		},
		getStatus: function(){
			return makePromise(
				{
					"statuses":
					[{
						"username":"bd20",
						"status":"Becoming a Web Developer!"
					}]
				}
			,this.haveLoggedIn)
		},
		getPosts: function(params){
			return makePromise(
				{
					"posts":
					[{
						"id":316455,
						"body":"post body",
						"date":"2016-01-16T17:08:16.383Z",
						"img":"http://lorempixel.com/328/250/",
						"comments":
							[{
								"commentId":1634135,
								"author":"bd20",
								"date":"2016-01-27T14:54:59.938Z",
								"body":"comment1"
							},
							{
								"commentId":12432,
								"author":"bd20",
								"date":"2016-03-16T22:24:16.680Z",
								"body":"comment2"
							}],
						"author":"bd20"
					},
					{
						"id":12345679,
						"body":"post body",
						"date":"2016-02-16T17:08:16.383Z",
						"img":"http://lorempixel.com/328/250/",
						"comments":
						[{
							"commentId":116234,
							"author":"dh15test",
							"date":"2016-01-27T14:54:59.938Z",
							"body":"comment1"
						},
						{
							"commentId":129070,
							"author":"yz78test",
							"date":"2016-03-16T22:24:16.680Z",
							"body":"comment2"
						}],
						"author":"bd20"
					}]
				},true)
		},
		upload: function(params){
			return makePromise(
				{
					"posts":
					[{
						"id":54663,
						"author":"bd20",
						"body":"New Post",
						"date":"2016-01-07T03:58:47.032Z",
						"comments":[]
					}]
				},true)
		},
		newComment: function(params){
			return makePromise(
			{
				"posts":
				[{
					"id":54362543,
					"body":"the new content",
					"date":"2016-01-16T17:08:16.383Z",
					"img":"http://lorempixel.com/328/250/",
					"comments":
						[{"commentId":1643,
						"author":"bd20",
						"date":"2016-02-27T14:54:59.938Z",
						"body":"the new content"},
						{"commentId":163414,
						"author":"sep1",
						"date":"2016-01-16T22:24:16.680Z",
						"body":"comment2"},
						{"commentId":6326,
						"author":"bd20test",
						"date":"2016-02-16T22:24:16.680Z",
						"body":"a new comment"}
						],
					"author":"sep1"},
				]
			},true)
		},
		login: function(params) {
			if(params.password == "12345678"){
				return makePromise({},true)
			}
			else{
				return makePromise({},false)
			}
		},
		logout: function(params){
			return makePromise({},true)
		},
		sample: function(){
			return makePromise(
				{
					"posts":
					[{
						"id":12345678,
						"body":"post body",
						"date":"2016-03-16T17:08:16.383Z",
						"img":"",
						"comments":
							[{
								"commentId":24314,
								"author":"bd20",
								"date":"2016-01-27T14:54:59.938Z",
								"body":"comment1"
							}],
					},
					{
						"id":4124,
						"body":"post body",
						"date":"2016-02-16T17:08:16.383Z",
						"img":"",
						"comments":
						[{
							"commentId":14231,
							"author":"bd20test",
							"date":"2016-01-27T14:54:59.938Z",
							"body":"comment1"
						}],
					}]
				},true)
		},
		putStatus: function(params){
			return makePromise(
				{
					"status":params.status,
				}
			,true)
		},
	}
	var mockUserService = {
		userName: "bd20",
		followerAvatars: [],
		setAvatar: function(user,avatar){this.followerAvatars[user]=avatar},
		login:true,
		updateStatus: function(isMain){
			this.login = ! this.login
		}
	}
	var resolveTestPromises = function(rootScope) {
		var count = promises.length
		promises.forEach(function(p) {
			if(p.accept){
				p.promise.resolve(p.response)
			}
			else{
				p.promise.reject(p.response)
			}
		})
		rootScope.$apply()
		if(promises.length>count){
			resolveTestPromises(rootScope);
		}
		else{
			promises.length = 0;
		}
	}

	jasmine.mockServices = {
		init: init,
		mockApiService: mockApiService,
		mockUserService: mockUserService,
		resolveTestPromises: resolveTestPromises
	}

})(window.jasmine)