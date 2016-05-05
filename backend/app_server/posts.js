/*
 * Posts.js
 * Bochuan Du
*/
var Post = require('./model.js').Post
var Profile = require('./model.js').Profile
var isLoggedIn = require('./auth.js').isLoggedIn
var uploadImg = require('./picture.js').uploadImg
var multer = require('multer')
exports.setup = function(app) {
     app.get('/posts/:id*?', isLoggedIn, getPost)
     app.post('/post', isLoggedIn, multer().single('image'),uploadImg, addPost)
     app.put('/posts/:id', isLoggedIn, editPost)
}

function getPost(req, res) {
	  console.log('call getPost', req.body)
    var id = req.params.id
    if (!id) {
    Profile.findOne({username: req.username}).exec(function(err,profile){
      var users = profile.following
      users.push(req.username)
      Post.find({author:{$in: users}})
        .sort({'_id':-1})
        .limit(10)
        .exec(function(err,posts){
          res.json({posts:posts})
        })
    })
  }
  else{
    Post.findOne({ _id: id }).exec(function(err, post) { 
      res.json(post)
    })
  }
}
function addPost(req, res) {
    console.log('call addPost()', req.body)
    var newPost = req.body
    newPost.date = new Date();
    newPost.author = req.username
    newPost.comments = [];
    if(req.imgUrl){
      newPost.img = req.imgUrl
    }
    Post.create(newPost,function(err,item){
      res.json({posts:[item]}); 
    })
}
function editPost(req, res) {
	  console.log('Call editPost', req.body)
    var id = req.params.id
    var commentId = req.body.commentId
    /*
    Update the post :id with a new body if commentId is not supplied. 
    Forbidden if the user does not own the post.
    If commentId is supplied, then update the requested comment on the post, if owned.
    If commentId is -1, then a new comment is posted with the body message.
    */
    if(commentId){
      if(commentId == -1){ //New comment
          var newComment = { author: req.username, date: new Date(), body: req.body.body}

          Post.findOneAndUpdate( {_id:id}, {$push:{comments:newComment}}, {new:true})
              .exec(function(err,newPost){
                res.send({posts: [newPost]})
                return 
              })
      }
      else{//Update comment
        Post.findOneAndUpdate( {_id:id, "comments._id":commentId, "comments.author":req.username},
                               {$set:{"comments.$.body":req.body.body}},
                               {new:true})
                               .exec(function(err,newPost){
                                if(!newPost){
                                res.status(401).send("Fobidden to edit other's comment")
                                return 
                              }
                              res.send({posts: [newPost]})
                              return 
                            })
      }
    }
    else {//Update post
      Post.findOneAndUpdate( {_id:id, author:req.username}, {body:req.body.body}, {new:true})
                             .exec(function(err,newPost){
                              if(!newPost){
                                res.status(401).send("Fobidden to edit other's post")
                                return 
                              }
                              res.send({posts:[newPost]})
                              return
                            })
    }
}