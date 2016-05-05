//picture.js
//Bochuan Du

var Profile = require('./model.js').Profile
var isLoggedIn = require('./auth.js').isLoggedIn

var multer = require('multer')
var stream = require('stream')
var cloudinary = require('cloudinary')
var md5 = require('md5')

exports.uploadImg = uploadImg

exports.setup = function(app){
	app.get('/picture/:user*?',isLoggedIn,getPicture);
	app.put('/picture',isLoggedIn, multer().single('image'), uploadImg, uploadAvatar);
}

function getPicture(req, res){
	console.log('call getPicture', req.body)
	var user = req.params.user
	if(!user){
		user = req.username
	}
	Profile.findOne({username:user}).exec(function(err,profile){
		res.send({username:profile.username, picture:profile.picture})
	})
}

function uploadAvatar(req, res){
	console.log('call uploadAvatar', req.body)
	Profile.findOneAndUpdate({username:req.username},
		{picture:req.imgUrl},
		{new:true}).exec(function(err,aProfile){
			res.send({username:aProfile.username, picture:aProfile.picture})
		})
}

function uploadImg(req, res,next) {
	console.log('call uploadImg', req.body)
	if(req.file){
		var publicName = md5(Math.random());

		var uploadStream = cloudinary.uploader.upload_stream(function(result) {    	
			var image = cloudinary.image(result.public_id, {
				format: "png", width: 500, crop: "fill"
			})
			req.imgUrl = result.secure_url
			next()
	
		}, { public_id: publicName })	

		var s = new stream.PassThrough()
		s.end(req.file.buffer)
		s.pipe(uploadStream)
		s.on('end', uploadStream.end)
	}
	else{
		next();
	}
}


