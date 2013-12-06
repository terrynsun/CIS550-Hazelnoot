var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var Q = require('q');

var User = require('../models').User;


module.exports = function() {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            Q(User.find({where: {user_name: username}}))
                .then(function(user) {
                    // Hash password and compare with hash in database
                    return Q.nfcall(bcrypt.compare, password, user.password_hash)
                        .then(function(res) {
                            if (!res) {
                                return done(null, false, { message: 'Invalid username and/or password'});
                            }
                            return done(null, user);
                        });
                })
                .fail(function(err) {
                    return done(null, false, { message: 'Invalid username and/or password' });
                })
                .done();
        }
    ));


    passport.serializeUser(function(user, done) {
        done(null, user.user_name);
    });

    passport.deserializeUser(function(user_name, done) {
        Q(User.find({where: {user_name: user_name}}))
            .then(function(user) {
                return done(null, user);
            })
            .fail(function(err) {
                return done(err, false);
            })
            .done();
    });
};