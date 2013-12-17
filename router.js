var passport = require('passport');

var routes = require('./routes');
var auth = require('./routes/auth');
var user = require('./routes/user');
var pin = require('./routes/pin');
var board = require('./routes/board');
var search = require('./routes/search');
var object = require('./routes/object');
var affiliation = require('./routes/affiliation');
var mongo = require('./routes/mongo');
var rating = require('./routes/rating');

var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
        return;
    }

    // FIXME: Open redirect vulnerability
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

    app.get('/pin/new', ensureAuthenticated, pin.newPinsPage);
    app.post('/pin/new', ensureAuthenticated, pin.newPin);
    app.post('/pin/remove', ensureAuthenticated, pin.removePin);
    app.get('/pin/:user_name/:board_name/:source/:object_id', pin.getPin);

    app.get('/user/me/update', ensureAuthenticated, user.updateProfilePage);
    app.post('/user/me/update', ensureAuthenticated, user.updateProfile);
    app.post('/user/me/update/password', ensureAuthenticated, user.updatePassword);

    app.get('/user/me/interests', ensureAuthenticated, user.updateInterestsPage);
    app.post('/user/me/interests/add', ensureAuthenticated, user.updateInterestsAdd);
    app.post('/user/me/interests/remove', ensureAuthenticated, user.updateInterestsRemove);

    app.get('/user/me/boards', ensureAuthenticated, user.updateBoardPage);
    app.post('/user/me/boards/add', ensureAuthenticated, user.updateBoardAdd);
    app.post('/user/me/boards/remove', ensureAuthenticated, user.updateBoardRemove);

    app.get('/user/:user_name/:board_name', board.index);
    app.post('/user/:user_name/:board_name/edit', ensureAuthenticated, board.edit);

    app.get('/search', search.getSearch);

    app.get('/object/:source/:id', object.index); //currently unused
    app.post('/rating/:source/:id', ensureAuthenticated, rating.changeRating);

    app.get('/affiliation/:name', affiliation.index);

    app.get('/search', search.getSearch);

    // requests have to be of type /mongo/bigtest?url=<url>, where <url> is properly encoded
    app.get('/mongo/bigtest', mongo.cache);
    app.get('/mongo/retrieve', mongo.get);
};
