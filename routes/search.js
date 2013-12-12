var Q = require('q');
var _ = require('underscore');
var PinObject = require('../models').PinObject;
var Tags = require('../models').Tags;
var sequelize = require('../app_config/sequelize');

// get all images tagged with a certain term
var getTagged = function(term) {
    var query = 'SELECT * FROM Object, Tags ' +
                'WHERE Object.id = Tags.object_id ' +
                'AND   Tags.tag = :term ' +
                'ORDER BY Object.created_at DESC';
    var parms = { term: term };
    return Q(sequelize.query(query, PinObject, Tags, parms));
};

/*
 * GET /search?term=<term>
 */
exports.getSearch = function(req, res) {
    var term = req.query.term;
    if(term) {
        getTagged(term)
        .then(function(taggedImages) {
            return res.render('search', {
                searchTerm: term,
                images: taggedImages
            });
        })
        .done();
    } else {
        res.render('error', {
            title: 'No search term given!',
            message: 'Search through the handy-dandy toolbar up there!'
        });
    }
};
