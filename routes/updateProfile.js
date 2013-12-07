var User = require('../models').User;
var Q = require('q');
var _ = require('underscore');


var render_user = function(current_user, res) {
    return Q(current_user.nsa())
        .then(function(info) {

            res.render('updateProfile', {
                current_user: current_user,
            });
        })
        .fail(function(err) {
            console.error(err);
            res.render('user/error', {
                title: 'Oh noes!',
                current_user: current_user,
                message: 'Something went wrong on our end while loading your account. ' +
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
        render_user(req.user, res).done();
    } else {    
                res.render('error', {
                    title: 'I just don\'t knw what went wrong!',
                    current_user: req.user,
                    message: 'Something went wrong on our end while loading your account. ' +
                        'Pleasetry again later.'
                })
            .done();
    }
};


/*
 * GET /user/me
 */
exports.me = function(req, res) {
    render_user(req.user, res).done();
};
