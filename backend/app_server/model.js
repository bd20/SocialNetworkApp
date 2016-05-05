// this is model.js 
var mongoose = require('mongoose')
require('./db.js')

var commentSchema = new mongoose.Schema({
	commentId: Number, author: String, date: Date, body: String
})
var postSchema = new mongoose.Schema({
	id: Number, author: String, img: String, date: Date, body: String,
	comments: [ commentSchema ]
})
var authSchema = new mongoose.Schema({
	provider: String, id: String, displayName: String
})
var userSchema = new mongoose.Schema({
    username: String, salt: String, hash: String, auth:[authSchema]
})
var profileSchema = new mongoose.Schema({
    username: String, status: String, following: [ String ], email: String,
    zipcode: String, picture: String    
})

exports.Post = mongoose.model('post', postSchema)
exports.User = mongoose.model('users', userSchema)
exports.Profile = mongoose.model('profiles', profileSchema)
