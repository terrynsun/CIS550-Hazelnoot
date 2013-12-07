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
            Q(user.getInterests())
                .then(function(interests) {
                    var interest_names = _.map(interests, function(interest) {
                        return interest.name;
                    });

                    res.render('user/profile', {
                        title: user.first_name + ' ' + user.last_name,
                        user: user,
                        interests: interest_names
                    });
                })
                .fail(function(err) {
                    res.render('user/profile', {
                        title: user.first_name + ' ' + user.last_name,
                        user: user
                    });
                })
                .done();
        })
        .fail(function(err) {
            res.render('user/not_found', {
                title: 'Sorry, this user does not exist'
            })
        })
        .done();
};