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
    app.use(app.router);
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    app.locals(locals);
};
