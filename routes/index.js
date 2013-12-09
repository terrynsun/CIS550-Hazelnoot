var PinObject = require('../models').PinObject;
var Pin = require('../models').Pin;
var Friendship = require('../models').Friendship;
var sequelize = require('../app_config/sequelize');
var Q = require('q');
var _ = require('underscore');

var getPinsByFriends = function(username) {
    var query = 'SELECT * FROM Object, Pin, Friendship ' +
                'WHERE Friendship.user_name = :name ' +
                'AND Friendship.friend_name = Pin.user_name ' +
                'AND Pin.object_id = Object.id ' +
                'LIMIT 5';
    var parms = { name: username };
    return Q(sequelize.query(query, null, { raw: true }, parms));
};

var getNewPins = function() {
    var query = 'SELECT * FROM Pin, Object ' +
                'WHERE Pin.object_id = Object.id ' +
                'ORDER BY Pin.created_at DESC ' +
                'LIMIT 5';
    return Q(sequelize.query(query, null, { raw: true }));
};

var getInterestingPins = function(username) {
    var query = 'SELECT * FROM Object, Tags, Interest ' +
                'WHERE Interest.user_name = :name ' +
                'AND   Tags.tag = Interest.name ' +
                'AND   Tags.object_id = Object.id ' +
                'LIMIT 5';
    var parms = { name: username };
    return Q(sequelize.query(query, null, { raw: true }, parms));
};

var renderLoggedInPage = function(req, res) {
    var display = {};
    getPinsByFriends(req.user.user_name)
    .then(function(results) {
        display.friendPins = results;
        return getNewPins();
    })
    .then(function(results) {
        display.newPins = results;
        return getInterestingPins(req.user.user_name);
    })
    .then(function(results) {
        display.interestingPins = results;
    })
    .then(function() {
          console.log(display.interestingPins);
          res.render('index', { 
          title: 'Hazlenoot',
          col1: display.friendPins,
          col2: display.newPins,
          col3: display.interestingPins,
          col4: display.newPins
        });
    })
    .done();
};

var renderLoggedOutPage = function(req, res) {
    var display = {};
    getNewPins()
    .then(function(results) {
        display.newPins = results;
    })
    .then(function() {
          console.log(display.newPins);
          res.render('index', { 
          title: 'Hazlenoot',
          newPins: display.newPins
        });
    })
    .fail(function(err) {
        console.log("Error: " + err);
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
