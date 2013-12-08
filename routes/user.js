var User = require('../models').User;
var Board = require('../models').Board;
var Q = require('q');
var _ = require('underscore');


var render_user = function(user, current_user, res) {
    return Q(user.nsa())
        .then(function(info) {
            var interest_names = _.map(info.interests, function(interest) {
                return interest.name;
            });
            var friends_names = _.map(info.friends, function(friend) {
                return friend.name();
            });
            var board_names = _.map(info.boards, function(board) {
                return board.name;
            });

            res.render('user/profile', {
                title: user.full_name(),
                current_user: current_user,
                user: user,
                interests: interest_names,
                friends: friends_names,
                boards: board_names
            });
        })
        .fail(function(err) {
            console.error(err);
            res.render('error', {
                title: 'Oh noes!',
                current_user: current_user,
                message: 'Something went wrong on our end while loading this user. ' +
                    'Please try again later.'
            });
        });
};

/*
 * GET /user/:user_name
 */
exports.index = function(req, res) {
    var user_name = req.params.user_name;

    // micro-optimization so we don't have to fetch info about myself
    if (req.isAuthenticated() && user_name === req.user.user_name) {
        render_user(req.user, req.user, res).done();
    } else {
        User.findByUsername(user_name)
            .then(function(user) {
                return render_user(user, req.user, res);
            })
            .fail(function(err) {
                res.render('error', {
                    title: 'Sorry, this user does not exist',
                    current_user: req.user,
                    message: 'The link you followed may be broken, or this page may ' +
                        'have been deleted.'
                })
            })
            .done();
    }
};


/*
 * GET /user/me
 */
exports.me = function(req, res) {
    render_user(req.user, req.user, res).done();
};
