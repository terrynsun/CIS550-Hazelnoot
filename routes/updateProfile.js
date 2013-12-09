var User = require('../models').User;
var bcrypt = require('bcrypt');
var Q = require('q');

var renderUserUpdate = function(current_user, res) {
    return Q(current_user.nsa())
        .then(function(info) {

            res.render('updateProfile', {
                title: 'Update your profile'
            });
        })
        .fail(function(err) {
            console.error(err);
            res.render('user/error', {
                title: 'Oh noes!',
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
    var firstName = req.body.firstName || "";
    var lastName = req.body.lastName || "";
    var email = req.body.email || "";
    var affiliation = req.body.affiliation || "";
    var newPassword1 = req.body.newPassword1 || "";
    var newPassword2 = req.body.newPassword2 || "";
    var password = req.body.password || "";

    Q.nfcall(bcrypt.compare, password, req.user.password_hash)
        .then(function(res){
            if (!res) {
                return done(null, false, { message: 'Invalid old password'});
            }
            return (Q.nfcall(bcrypt.hash, newPassword1, 10), Q.nfcall(bcrypt.hash, newPassword2, 10));
        })
        .then(function(hash1, hash2) {
            if(newPassword1){
                if(hash1 != hash2){
                    
                }
                req.user.password_hash = hash1;
            }
            if(firstName) req.user.first_name = firstName;
            if(lastName) req.user.last_name = lastName;
            if(email) req.user.email = email;
            if(affiliation) req.user.affiliation = affiliation;
            return (req.user.save());
        })
        .then(function(user) {
            console.log("Updated user " + user.user_name + ".");
            return res.redirect('/user/me');
        })
        .fail(function(err) {
            console.error(err);
            req.flash('error', err.message);
            return res.redirect('/user/me/update');
        })
        .done();
};
