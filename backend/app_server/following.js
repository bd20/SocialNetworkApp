/*
following.js
Bochuan Du
*/

var Profile = require('./model.js').Profile
var isLoggedIn = require('./auth.js').isLoggedIn
exports.setup = function(app) {
	app.get('/following/:user*?', isLoggedIn, getFollowing);
	app.put('/following/:user', isLoggedIn, addFollowing);
	app.delete('/following/:user', isLoggedIn, removeFollowing);
}

//get the list of users being followed by the requested user
function getFollowing(req, res){
	console.log('Called getFollowing', req.body)
	var user = req.params.user
	if(!user){
		user = req.username;
	}
	Profile.findOne(
		{username: user})
		.exec(function(err, item) {	
		res.send({username:user, following: item.following})
	})
}

//add :user to the following list for the loggedInUser
function addFollowing(req, res){
	console.log('Called addFollowing', req.body)
	var user = req.params.user
	if(user == req.username){ //No need to follow oneself
		Profile.findOne(
			{username:req.username})
			.exec(function(err, profile){
			res.send({username: profile.username,
				following: profile.following})
		})
		return
	}
	Profile.findOne({username: user})
			.exec(function(err, follower){
				if(follower){
					Profile.findOneAndUpdate({username: req.username},
					{$addToSet: {following: follower.username}},
					{new:true})
					.exec(function(err, profile) {
		    		    res.send({username: profile.username, following: profile.following})
		    		})
				}
				else{
					res.status(404).send("No such user")
				}
				
			})
}
//remove :user to the following list for the loggedInUser
function removeFollowing(req, res){
	console.log('Called removeFollowing', req.body)
	Profile.findOneAndUpdate(
			{username: req.username},
			{$pull: {following: req.params.user}},
			{new:true})
			.exec(function(err, profile) {
		    	res.send({username: profile.username, following: profile.following})
		    })

}