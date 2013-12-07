var User = require('../models').User;

/*
 * GET /user/:user_name
 */
exports.index = function(req, res) {
    var user_name = req.params.user_name;
    User.findByUsername(user_name)
        .then(function(user) {
            res.render('user/profile', {
                title: user.first_name + ' ' + user.last_name,
                user: user
            })
        })
        .fail(function(err) {
            res.render('user/not_found', {
                title: 'Sorry, this user does not exist'
            })
        })
        .done();
};