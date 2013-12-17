var sequelize = require('../app_config/sequelize');
var Q = require('q');
var _ = require('underscore');

// get all users of a certain affiliation
var getAffiliationMembers = function(groupName) {
    var query = 'SELECT * FROM Users ' +
                'WHERE affiliation = :name';
    var parms = { name: groupName };
    return Q(sequelize.query(query, null, { raw: true }, parms));
};

var renderAffiliation = function(name, res) {
    getAffiliationMembers(name)
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
