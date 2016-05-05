// auth.js
// Bochuan Du
var User = require('./model.js').User
var Profile = require('./model.js').Profile
var redis = require('redis').createClient(process.env.REDIS_URL)
var FRONT_END_URL = "https://bochuan.herokuapp.com/"
var session = require('express-session')
var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var config = {
  clientSecret: '73724ee7d38fe67f2530a0237589fd25',
  clientID: '1141056615946382',
  callbackURL: 'https://bd20-inclassbe.herokuapp.com/callback'
}

exports.setup = function(app) {
     app.post('/register', register)
     app.post('/login',login)
     app.put('/logout', isLoggedIn, logout)
     app.put('/password', isLoggedIn, changePassword)
     app.use(session({ secret: 'thisIsMySecretMsg'}))
     app.use(passport.initialize())
     app.use(passport.session())
     app.get('/auth/facebook',passport.authenticate('facebook', {scope:'email'}))
     app.get('/callback', passport.authenticate('facebook', { failureRedirect: '/' }), isLoggedIn, callback)
     app.post('/linklocal',isLoggedIn,linkLocalAccount);
     app.get('/auth/unlink', isLoggedIn, unlinkFacebook);
}
exports.isLoggedIn = isLoggedIn


var users = {};
// serialize the user for the session
passport.serializeUser(function(user, done){
  console.log(user)
  users[user.id] = user
  done(null, user.id)
})
//deserialize the user from the session
passport.deserializeUser(function(id, done){
  console.log(users[id])
  var user = users[id]
  done(null, user)
})
passport.use(new FacebookStrategy(config,
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
          return done(null, profile);
      })
  })
)
var cookieKey = 'sid'
var sessionUser = {}
var md5 = require('md5')
function register(req, res) {
    console.log('call register()', req.body)
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email
    var zipcode = req.body.zipcode

    User.findOne({ username: username}).exec(function(err, item) { 
      if(item){
        res.status(401).send("username is taken");
      }
      else {
        var salt = md5(Math.random())
        var hash = md5(password + salt)
        //New User to DB
        var newUser = {username: username, salt: salt, hash: hash}
        new User(newUser).save()
        //New Profile to DB
        var newProfile = {
              username: username,
              status: "Hello from the first status",
              following: [],
              email: email,
              zipcode: zipcode,
              picture: null}
        new Profile(newProfile).save()


        res.send("successfully registered");
      }
    })
}
//log in to server, sets session id and hash cookies
function login(req, res){
  console.log('call login()', req.body)
  var username = req.body.username
  var password = req.body.password
  User.findOne({ username: username }).exec(function(err, item) { 
    if(!item) {
      res.sendStatus(400) //Bad Request
      return
    }
    else {
      var userObj = item
      if(userObj.hash == md5(password + userObj.salt)){
        res.cookie(cookieKey, generateCode(userObj), { maxAge: 3600*1000, httpOnly: true})
        //sessionUser[generateCode(userObj)] = username
        redis.set(generateCode(userObj), username)
        var msg = {username: username, result:'successfully log in'}
        res.send(msg)
      }
      else{
        res.sendStatus(401) //Unauthorized
        return
      }
    }
  })
}
function generateCode(userObj) {
  return md5(userObj.username)
}
function isLoggedIn(req, res, next) {
  console.log('called isLoggedIn')
  var sid = req.cookies[cookieKey]
  if(!sid) {
    if(req.isAuthenticated()){
      console.log('!sid isAuthenticated', req.username)
      req.username = req.session.passport.user.displayName+"@Facebook"
      next()
    }
    else{
      console.log('!sid Unauthorized', req.username)
      res.status(401).send("unauthorized"); //Unauthorized
    }
  }
  else{
      console.log('now redis')
      redis.get(sid,function(err, reply) {
        if(!reply){
          if(req.isAuthenticated()){
            req.username = req.session.passport.user.displayName+"@Facebook"
            console.log('Redis isAuthenticated', req.username)
            return next()
          }
          else{
            console.log('Redis Unauthorized', req.username)
            res.status(401).send("unauthorized");
          }
        }
        else{
          console.log('redis name', reply)
          req.username = reply.toString()
          return next()
        }
      })
  }
}
//log out of server, clears session id
function logout(req, res) {
  console.log('call logout()', req.body)
  if(req.username){
    if(req.cookies && req.cookies[cookieKey]){
      redis.del(req.cookies[cookieKey]);
    }
    //sessionUser = {};
    req.logout();
    //res.send("Logged out")
  }
}
//Change password
function changePassword(req, res) {
  console.log('call changePassword()', req.body)
  var username = req.username
  var password = req.body.password
  var salt = md5(Math.random())
  var hash = md5(password + salt)
  var newInfo = {salt: salt, hash: hash}
  //Update user's password
  User.findOneAndUpdate({ username: username }, newInfo)
  .exec(function(err, item) {
    if(!err) {
      res.send({status:"Change the password successfully"})
    }
    else {
      res.sendStatus(500)
    }
  })
}
function callback(req, res) {
  console.log('call callback()', req.body)
  if(req.username.indexOf("@Facebook") != -1){
    User.findOne({"auth.provider":req.user.provider,
      "auth.id":req.user.id}).exec(function(err,aUser){
        if(aUser){
            authLogin(req, res, aUser,function(){
            res.redirect(FRONT_END_URL+"#/main/")
          })
        }
        else{
            authRegister(req, res,function(){
            res.redirect(FRONT_END_URL+"#/main/")
          })
        }
    })
  }
  else{
      authLink(req, res, function(){
        res.redirect(FRONT_END_URL+"#/main/")
      })
  }
}
function authLink(req, res, next){
  console.log('call authLink()', req.body)
  User.findOneAndUpdate({username:req.username},
    {$push:
      {auth:
        {provider: req.user.provider, 
        id: req.user.id, 
        displayName: req.user.displayName}
      }
    }).exec(function(){
      next();
    })
}
function authRegister(req, res, next){
  console.log('call authRegister()', req.body)
  var newUser = {
    username: req.user.displayName+"@Facebook",
    auth:[{
      provider: req.user.provider, 
      id: req.user.id, 
      displayName: req.user.displayName
    }]
  }
  new User(newUser).save()
  console.log('1')

  var newProfile  = {
        username: newUser.username,
        status: "Hello from the first status",
        following: [],
        email: "email@email.com",
        zipcode: "99999",
        picture: ""}
  new Profile(newProfile).save()
  console.log('2')

  res.cookie(cookieKey, generateCode(newUser), { maxAge: 3600*1000, httpOnly: true})
  redis.set(generateCode(newUser), newUser.username)
  next()
}
function authLogin(req, res, aUser,next){
  console.log('call authLogin()', req.body)
  console.log('call authLogin() username', aUser.username)
  res.cookie(cookieKey, generateCode(aUser), { maxAge: 3600*1000, httpOnly: true})
  redis.set(generateCode(aUser), aUser.username)
  next()
}
function linkLocalAccount(req,res){
  console.log('call linkLocalAccount()', req.body)
  var user = req.body
  var fb_name = req.username
  if(req.username.indexOf("@Facebook") != -1){
    User.findOne({ username: user.username}).exec(function(err, item) { 
      if(!item){
        res.status(404).send("user not found");
      }
      else{
        var aUser = item
        if(aUser.hash == md5(user.password + aUser.salt)){
          
          res.cookie(cookieKey, generateCode(aUser), { maxAge: 3600*1000, httpOnly: true})
          redis.set(generateCode(aUser), aUser.username)

          Profile.findOneAndRemove({username: fb_name}).exec();

          User.findOneAndRemove({username: fb_name}).exec(function(err,itemRemoved){
            User.findOneAndUpdate({username:aUser.username},
              {$push:
                {auth:
                  itemRemoved.auth[0]
                }
              }).exec(function(){
                  console.log('link local account success')
                  res.send("link local account success");
              })  
          })
        }
        else{
          res.status(401).send("wrong password")
        }
      }
    })
  }
}
function unlinkFacebook(req, res){
  User.findOne({username:req.username}).exec(function(err,aUser){
    if(aUser){
      if(aUser.hash){
        User.findOneAndUpdate({username:req.username},{$pull:{auth:{provider:'facebook'}}})
        .exec(function(err,item){
          res.send("successfully unlink facebook account");
        })
      }
      else{
        res.status(403).send("You should set your password before unlink")
      }
    }
  })
}

