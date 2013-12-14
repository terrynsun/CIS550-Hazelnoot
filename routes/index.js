var sequelize = require('../app_config/sequelize');
var Q = require('q');
var _ = require('underscore');

// n objects pinned by friends, newest first
var getPinsByFriends = function(username, n) {
    var query = 'SELECT * FROM Object, Pin, Friendship ' +
                'WHERE Friendship.user_name = :name ' +
                'AND Friendship.friend_name = Pin.user_name ' +
                'AND Pin.object_id = Object.id ' +
                'ORDER BY Pin.created_at DESC ' +
                'LIMIT :num';
    var parms = { name: username, num: n };
    return Q(sequelize.query(query, null, { raw: true }, parms));
};

// n newest pins
var getNewPins = function(n) {
    var query = 'SELECT * FROM Pin, Object ' +
                'WHERE Pin.object_id = Object.id ' +
                'ORDER BY Pin.created_at DESC ' +
                'LIMIT :num';
    var parms = { num: n };
    return Q(sequelize.query(query, null, { raw: true }, parms));
};

// given a user, n objects that are tagged with their interests, newest first
var getInterestingPins = function(username, n) {
    var query = 'SELECT * FROM Object, Tags, Interest ' +
                'WHERE Interest.user_name = :name ' +
                'AND   Tags.tag = Interest.name ' +
                'AND   Tags.object_id = Object.id ' +
                'ORDER BY Object.created_at DESC ' +
                'LIMIT :num';
    var parms = { name: username, num:n };
    return Q(sequelize.query(query, null, { raw: true }, parms));
};

var renderLoggedInPage = function(req, res) {
    var display = {};
    getPinsByFriends(req.user.user_name, 8)
    .then(function(results) {
        display.friendPins = results;
        return getNewPins(8);
    })
    .then(function(results) {
        display.newPins = results;
        return getInterestingPins(req.user.user_name, 8);
    })
    .then(function(results) {
        display.interestingPins = results;
    })
    .then(function() {
          res.render('index', { 
          title: 'Hazlenoot',
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
    getNewPins(20)
    .then(function(results) {
        display.newPins = results;
    })
    .then(function() {
          res.render('index', { 
          title: 'Hazlenoot',
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
