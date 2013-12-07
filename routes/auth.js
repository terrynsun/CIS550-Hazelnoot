var User = require('../models').User;
var bcrypt = require('bcrypt');
var Q = require('Q');

/*
 * GET /login
 *
 * The login page. Use POST /login for actual logging in.
 */
exports.login_page = function(req, res) {
    var redirect_url = req.query.redirect || '/';
    if (req.isAuthenticated()) {
        res.redirect(redirect_url);
        return;
    }

    res.render('login', {
        title: "Login",
        action_url: '/login?redirect=' + redirect_url,
        messages: req.flash('error')
    });
};

/*
 * GET /logout
 *
 * Logs the user out.
 * TODO: CSRF protection.
 */
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/*
 * GET /register
 */
exports.register_page = function(req, res) {
    res.render('register', { title: 'Register', messages: req.flash('error') });
};

/*
 * POST /register
 */
exports.register = function(req, res) {
    var user_name = req.body.user_name;
    var email = req.body.email;
    var password = req.body.password;

    // Check a user doesn't already exist
    User.exists(user_name, email)
        .then(function(users) {
            if (users.length > 0) {
                // Throw an error (forcing the 'fail' promise to fulfill)
                var error = new Error('User already exists');
                error.name = 'UserAlreadyExistsError';
                throw error;
            }

            // Hash password with bcrypt
            return Q.nfcall(bcrypt.hash, password, 10);
        })
        .then(function(hash) {
            // Build and validate the user (throws an error if this fails validations)
            var user = User.build({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                user_name: user_name,
                email: email,
                password_hash: hash
            });

            return Q(user.save());
        })
        .then(function(user) {
            console.log("New user " + user.user_name + " created.");

            // Deferreds: https://github.com/kriskowal/q#using-deferreds
            // Log in the user so the user doesn't have to re-login after registering
            var deferred = Q.defer();
            req.login(user, function(err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(user);
                }
            });

            return deferred.promise;
        })
        .then(function(user) {
            // Success!
            req.flash('info', 'Thanks for signing up, ' + user.first_name);
            return res.redirect('/');
        })
        .fail(function(err) {
            console.error(err);
            req.flash('error', err.message);
            return res.redirect('/register');
        })
        .done();
};
