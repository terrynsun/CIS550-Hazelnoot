var passport = require('passport');

var routes = require('./routes');
var auth = require('./routes/auth');
var user = require('./routes/user');
var board = require('./routes/board');
var upProf = require('./routes/updateProfile');

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }

    // WARN: Potential security vulnerability if req.originalUrl isn't escaped properly
    var login_url = '/login?redirect=' + req.originalUrl;
    res.redirect(login_url);
};

module.exports = function(app) {
    app.get('/', routes.index);

    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), function(req, res) {
        var redirect_url = req.query.redirect || '/';
        res.redirect(redirect_url);
    });
    app.get('/login', auth.login_page);
    app.get('/logout', auth.logout);
    app.get('/register', auth.register_page);
    app.post('/register', auth.register);

    // Order matters here
    app.get('/user/me', ensureAuthenticated, user.me);
    app.get('/user/:user_name', user.index);

    app.get('/boards/:user_name/:board_name', board.index);

    //Richie Testing
    app.get('/updateProfile', ensureAuthenticated, upProf.updateProfilePage);
};
