var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();
app.use(cors());

var routes = require('./routes/index');
var users = require('./routes/users');
var ideas = require('./routes/ideas');
var resources = require('./routes/resources');
var votes = require('./routes/votes');
var teams = require('./routes/teams');
var compositions = require('./routes/compositions');
/*
 //Proxy for passport
 var globalTunnel = require('global-tunnel');
 
 globalTunnel.initialize({
 host: 'www-proxy.idc.oracle.com',
 port: 80
 
 });
 */

//----------------------------Authentication Module Starts-----------------------------
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

passport.use(new GithubStrategy({
    clientID: '86a1fd9ad1c18caf9c1e',
    clientSecret: '67550960752d7fea2532b34efbe01488821cf1ac',
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
            //proxy:'http://www-proxy.idc.oracle.com:80'
},
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
));
// Express and Passport Session
var session = require('express-session');


//Can be anything for this e.g
app.use(session({secret: '67550960752d7fea2532b34efbe01488821cf1ac'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    // placeholder for custom user serialization
    // null is for errors
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    // placeholder for custom user deserialization.
    // maybe you are going to get the user from mongo by id?
    // null is for errors
    done(null, user);
});
// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));
//http://stackoverflow.com/questions/33639337/use-passport-js-behind-corporate-firewall-for-facebook-strategy
// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}),
        function (req, res) {
            res.redirect('/');
        }
);
app.get('/logout', function (req, res) {
    console.log('logging out');
    req.logout();
    res.redirect('/');
});
// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/')
}

//----------------------------Authentication Module Ends-----------------------------

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/ideaDB');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('env', 'development');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ideas', ideas);
app.use('/users/:userId/ideas', ideas);
app.use('/resources', resources);
app.use('/votes', votes);
app.use('/teams', teams);
app.use('/compositions', compositions);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//http://www.jokecamp.com/tutorial-passportjs-authentication-in-nodejs/
//http://stackoverflow.com/questions/9230932/file-structure-of-mongoose-nodejs-project
module.exports = app;
