var Q = require('q');
var _ = require('underscore');
var PinObject = require('../models').PinObject;
var Tags = require('../models').Tags;
var sequelize = require('../app_config/sequelize');

var getTagged = function(term) {
    var query = 'SELECT * FROM Object, Tags ' +
                'WHERE Object.id = Tags.object_id ' +
                'AND   Tags.tag = :term';
    var parms = { term: term };
    return Q(sequelize.query(query, PinObject, Tags, parms));
};

/*
 * GET /search?term=<term>
 */
exports.getSearch = function(req, res) {
    var term = req.query.term;
    if(term) {
        req.body.term = req.params.term;
        getTagged(term)
            .then(function(returnedObjects) {
                var taggedImages = _.map(returnedObjects, function(img) {
                    return img.dataValues;
                });

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
