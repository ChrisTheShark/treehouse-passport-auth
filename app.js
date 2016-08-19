'use strict';
const express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    GitHubStrategy = require('passport-github').Strategy,
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    User = require("./models/user");

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackUrl: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    User.findOneAndUpdate({
        name: profile.username
    }, {
        $set: {
            name: profile.username,
            photo: profile.photos[0].value
        }
    }, {
        new: true,
        upsert: true
    }, (error, user) => {
        done(error, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((userId, done) => {
    User.findById({
        _id: userId
    }).then((user) => {
        done(null, user);
    });
});

let routes = require('./routes/index');
let auth = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// mongodb connection
mongoose.connect("mongodb://localhost:27017/bookworm-oauth");
let db = mongoose.connection;

// Session config for Passport and MongoDb
let sessionOptions = {
    secret: 'super duper secret',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
}

app.use(session(sessionOptions));

// Initialize Passport
app.use(passport.initialize());

// Restore Session
app.use(passport.session());

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

app.use('/', routes);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
