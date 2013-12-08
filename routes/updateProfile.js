var User = require('../models').User;
var bcrypt = require('bcrypt');
var Q = require('q');
var _ = require('underscore');


var renderUserUpdate = function(current_user, res) {
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
 * GET /updateProfile.updateProfilePage
 */
exports.updateProfilePage = function(req, res) {
    renderUserUpdate(req.user, res).done();
};



/*
 * POST /updateProfile.updateProfile
 */
exports.updateProfile = function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var association = req.body.association;
    var newPassword1 = req.body.newPassword1;
    var newPassword2 = req.body.newPassword2;
    var password = req.body.password;

};
