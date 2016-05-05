var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

var app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(corsSet);
require('./app_server/posts.js').setup(app)
require('./app_server/profile.js').setup(app)
require('./app_server/auth.js').setup(app)
require('./app_server/following.js').setup(app)
require('./app_server/picture.js').setup(app)
require('./app_server/uploadCloudinary.js').setup(app)

function corsSet(req, res, next) {
	res.header("Access-Control-Allow-Origin", req.header('Origin'));
	res.header('Access-Control-Allow-Credentials','true');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if(req.method == 'OPTIONS') {
		res.send(200);
	}	
	next();
}

if (process.env.NODE_ENV !== "production") {
	require('dotenv').load()
}

// Get the port from the environment, i.e., Heroku sets it
var port = process.env.PORT || 3000

//////////////////////////////////////////////////////
var server = app.listen(port, function() {
     console.log('Server listening at http://%s:%s', 
               server.address().address,
               server.address().port)
})