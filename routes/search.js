var models = require('../models');
var PinObject = models.PinObject;
var Q = require('q');
var _ = require('underscore');
var sequelize = require('../app_config/sequelize');

/*
 * GET /search?term=<term>
 */
exports.getSearch = function(req, res) {
    var term = req.query.term;
    if(term) {
        PinObject.getByTag(term)
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
