var mongoose = require('mongoose')
var url = 'mongodb://heroku_hjs8zmsm:m70csjnco8u2832ppmrdtsgq9d@ds023520.mlab.com:23520/heroku_hjs8zmsm'

mongoose.connect(url)

//Close connection to mongoDB
function shutdown(msg, callback){
	mongoose.connection.close(function() {
		callback()
	})
}

