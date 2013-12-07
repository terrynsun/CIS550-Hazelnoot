var passport = require('passport');

var routes = require('./routes');
var auth = require('./routes/auth');

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
};