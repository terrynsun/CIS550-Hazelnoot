var sequelize = require('../app_config/sequelize');
var Pin = require('../models').Pin;
var Q = require('q');
var _ = require('underscore');

var renderLoggedInPage = function(req, res) {
    var display = {};
    Pin.getFriendPins(req.user.user_name, 8)
    .then(function(results) {
        display.friendPins = results;
        console.log(results);
        return Pin.getNewest(8);
    })
    .then(function(results) {
        display.newPins = results;
        return Pin.getByUserInterest(req.user.user_name, 8);
    })
    .then(function(results) {
        display.interestingPins = results;
    })
    .then(function() {
          res.render('index', { 
          title: 'Hazelnoot',
          friendPins: display.friendPins,
          newPins: display.newPins,
          interestingPins: display.interestingPins,
        });
    })
    .fail(function(err) {
        console.error(err);
        res.render('error', {
            title: 'Something has gone terribly wrong.',
            message: 'Our bad! Try again in a little while.'
        });
    })
    .done();
};

var renderLoggedOutPage = function(req, res) {
    var display = {};
    Pin.getNewest(20)
    .then(function(results) {
        display.newPins = results;
    })
    .then(function() {
          res.render('index', { 
          title: 'Hazelnoot',
          newPins: display.newPins
        });
    })
    .fail(function(err) {
        console.error(err);
        res.render('error', {
            title: 'Something has gone terribly wrong.',
            message: 'Our bad! Try again in a little while.'
        });
    })
    .done();
};

/*
 * GET home page.
 */
exports.index = function(req, res){
    if(req.user) {
        renderLoggedInPage(req, res);
    } else {
        renderLoggedOutPage(req, res);
    }
};
