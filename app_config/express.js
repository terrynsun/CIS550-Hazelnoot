var express = require('express');
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');

var utils = require('../utils');

var locals = {
    moment: require('moment'),
    isImage: utils.isImage
};

module.exports = function(app) {
    // all environments
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.locals(locals);
    // Middleware for common request-specific locals
    app.use(function(req, res, next) {
        res.locals.current_user = req.user;
        res.locals.flash_messages = req.flash();

        res.render_error = function(message, code) {
            res.status(code || 500);
            res.render('error', {
                title: 'Oh noes!',
                message: message
            });
        };
        next();
    });
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '..', 'public')));

    app.use(function(req, res) {
        res.status(400);
        res.render('404', {
            title: '404'
        })
    });

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
};
