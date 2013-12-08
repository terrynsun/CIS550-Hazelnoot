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
 * POST /search
 */
var postSearch = function(req, res) {
    var searchTerm = req.body.term;
    if(!searchTerm) {
        noParam(req, res);
    }

    getTagged(searchTerm)
    .then(function(returnedObjects) {
        var taggedImages = _.map(returnedObjects, function(img) {
            return img.dataValues;
        });

        return res.render('search', {
            searchTerm: searchTerm,
            current_user: req.user,
            images: taggedImages
        });
    })
    .done();
};

/*
 * GET /search/:term
 */
var getSearch = function(req, res) {
  if(req.params.term) {
    req.body.term = req.params.term;
    postSearch(req, res);
  } else {
    noParam(req, res);
  }
};

/*
 * GET /search/
 */
var noParam = function(req, res) {
    return res.render('error', {
        title: 'No search term given!',
        current_under: req.user,
        message: 'Search through the handy-dandy toolbar up there!'
    });
};

exports.postSearch = postSearch;
exports.getSearch = getSearch;
exports.noParam = noParam;
