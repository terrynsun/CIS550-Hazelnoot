var User = require('../models').User;
var Q = require('q');
var _ = require('underscore');

/*
 * GET /user/:user_name
 */
exports.index = function(req, res) {
    var user_name = req.params.user_name;
    User.findByUsername(user_name)
        .then(function(user) {
            return Q(user.nsa()).then(function(info) {
                var interest_names = _.map(info.interests, function(interest) {
                    return interest.name;
                });
                var friends_names = _.map(info.friends, function(friend) {
                    return friend.name();
                });

                res.render('user/profile', {
                    title: user.full_name(),
                    user: user,
                    interests: interest_names,
                    friends: friends_names
                });
            }).fail(function(err) {
                console.error(err);
                res.render('user/error', {
                    title: 'Oh noes!',
                    message: 'Something went wrong on our end while loading this user. ' +
                        'Please try again later.'
                });
            });
        })
        .fail(function(err) {
            res.render('user/error', {
                title: 'Sorry, this user does not exist',
                message: 'The link you followed may be broken, or this user may have ' +
                    'been deleted.'
            })
        })
        .done();
};