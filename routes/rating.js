var Q = require('q');
var _ = require('underscore');

var models = require('../models');
var PinObject = models.PinObject;
var Rating = models.Rating;

var utils = require('../utils');

/*
 * GET /rating/:id
 */
exports.rating = function(req, res) {
    var id = req.params.id;
    var avgVar;
    if (!id) {
        res.redirect('/');
        return;
    }

    Rating.getAverageByID(id)
    .then(function(avgLoc) {

        avgVar = avgLoc;
        
        return(PinObject.findByID(id));
    })
    .then(function(curObj) {
        res.render('rating', {
            id: id,
            avgDisplay: avgVar[0].avg,
            pic: curObj.url
        });
    })
    .fail(function(err) {
        console.log(err);
        res.render('error', {
            title: 'An error occured while looking up ratings',
            message: 'The link you followed may be broken, or this page may ' +
                'have been deleted.'
            })
    })
    .done();
};

