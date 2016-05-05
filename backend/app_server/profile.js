/*
profile.js
Bochuan Du
*/
var Post = require('./model.js').Post
var Profile = require('./model.js').Profile
var isLoggedIn = require('./auth.js').isLoggedIn

exports.setup = function(app) {
     app.get('/', index)
     app.get('/status', isLoggedIn, getStatus)
     app.put('/status', isLoggedIn, putStatus)
     app.get('/statuses/:user*?', isLoggedIn, getUserStatus)
     app.get('/email/:users', isLoggedIn, getUserEmail)
     app.put('/email', isLoggedIn, putEmail)
     app.get('/zipcode/:users', isLoggedIn, getUserZipcode)
     app.put('/zipcode', isLoggedIn, putZipcode)
     //app.get('/pictures/:users', getUserPicture)
     //app.put('/pictures', putPicture)
}

function index(req, res) {
    res.send({hello:'world'})
}

//===Status===//
//Get the status for the loggedInUser
function getStatus(req, res) {
	console.log('Call getStatus()', req.params.user) 
    var user = req.params.user;
	if(!user){
		user = req.username;
	}
	Profile.findOne({username:user}).exec(function(err,profile){
		res.send({statuses: [
			{username: profile.username, 
				status: profile.status}]})
	})
}
//Update the status for the loggedInUser
function putStatus(req, res) {
	console.log('Call putStatus', req.body)
	Profile.findOneAndUpdate( 
		{username: req.username}, 
		{status: req.body.status}, {new:true})
		.exec(function(err,profile){
			res.send({username: profile.username,
				status:profile.status})
	})
}
//Get the statuses for multiple users
function getUserStatus(req, res) {
	console.log('Call getUserStatus', req.body)
	var users
	if(req.params.user){
		users= req.params.user.split(',')
	}
	else{
		users=[];
	}
	Profile.find(
		{username:{$in: users}})
		.exec(function(err,profiles){
			var statuses = []
			profiles.forEach(function(profile){
				statuses.push({username: profile.username, 
					status: profile.status})
			})
			res.json({statuses: statuses})
		})
}

//===Email===//
//update the email addres for the loggedInUser
function putEmail(req, res) {
	console.log('Call putEmail', req.body)
	Profile.findOneAndUpdate(
		{username: req.username},
		{email: req.body.email},
		{new:true})
		.exec(function(err,profile){
			res.json({username: profile.username,
				email: profile.email})
		})
}

//get the email address for the requested user
function getUserEmail(req, res) {
	console.log('Call getUserEmail', req.body)
	var user = req.params.user
	if(!req.params.user){
		user = req.username
	}
	Profile.findOne(
		{username: user})
		.exec(function(err, profile){
		res.send({username: profile.username, email: profile.email})
	})
}

//===Zipcode===//
//update the zipcode for the loggedInUser
function putZipcode(req, res) {
	console.log('Call putZipcode', req.body)
	Profile.findOneAndUpdate(
		{username: req.username},
		{zipcode: req.body.zipcode}, {new:true})
		.exec(function(err, profile){
			res.send({username: profile.username, zipcode:profile.zipcode})
		})
}
//get the zipcode for the requested user
function getUserZipcode(req, res) {
	console.log('Call getUserZipcode', req.body)
	var user = req.params.user
	if(!req.params.user){
		user = req.username
	}
	Profile.findOne(
		{username: user})
		.exec(function(err,profile){
		res.send({username: profile.username, zipcode: profile.zipcode})
	})
}
function putPicture(req, res) {
	console.log('Call putPicture', req.body)
	res.send({ username: bd20, picture: null })
}
function getUserPicture(req, res) {
	console.log('Call getUserPic', req.body)
	res.send({pictures: [{ username: bd20, picture: null }]})
}