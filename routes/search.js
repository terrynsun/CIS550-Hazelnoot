var models = require('../models');
var PinObject = models.PinObject;
var Board = models.Board;
var User = models.User;
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
            return Board.findByBoardName(term)
            .then(function(boardNames) {
                return User.findByUsername(term)
                .then(function(username) {
                    // console.log(boardNames);
                    // console.log(taggedImages);
                    // console.log(username.dataValues);
                    return res.render('search', {
                        searchTerm: term,
                        images: taggedImages, // this is an array
                        boards: boardNames, // this is an array
                        user: username // this is a JSON object or null
                    });
                })
            })
        })
        .done();
    } else {
        res.render('error', {
            title: 'No search term given!',
            message: 'Search through the handy-dandy toolbar up there!'
        });
    }
};
