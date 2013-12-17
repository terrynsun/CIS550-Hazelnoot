var sequelize = require('../app_config/sequelize');
var User = require('../models').User;
var Q = require('q');
var _ = require('underscore');

var renderAffiliation = function(name, res) {
    User.getAffiliationMembers(name)
    .then(function(members) {
        var memberUsernames = _.map(members, function(member) {
            return member.user_name;
        });

        res.render('affiliation', {
            title: 'Affiliation Page' + name, 
            users: memberUsernames,
            affiliation: name
        });
    })
    .fail(function(err) {
        console.error(err);
        res.render('error', {
            title: 'Affiliation does not exist',
            message: 'Maybe you should join this group.'
        });
    })
    .done();
};

/*
 * GET /affiliation/:name
 */
exports.index = function(req, res) {
    var affiliationName = req.params.name;
    renderAffiliation(affiliationName, res);
};
