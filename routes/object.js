var Q = require('q');
var _ = require('underscore');

var models = require('../models');
var PinObject = models.PinObject;
var Rating = models.Rating;
var User = models.User;
var utils = require('../utils');

/*
 * GET /rating/:id
 */
exports.index = function(req, res) {
    var id = req.params.id;
    var avgVar;
    var pic;
    var lastRating = 0;

    if (!id) {
        res.redirect('/');
        return;
    }

    Q(Rating.getAverageByID(id))
    .then(function(avgLoc) {
        avgVar = avgLoc;
        
        return(PinObject.findByID(id));
    })
    .then(function(curObj) {
        if(curObj){
            if(avgVar[0]){
                avgVar = avgVar[0].avg;
            } else{
                avgVar = 0;
            }
            pic = curObj;
        } else{
            res.render('error', {
                title: 'This photo doesn\'t appear to exist!',
                message: 'The link you followed may be broken, or this page may ' +
                    'have been deleted.'
            })
            .done();
        }

        if(req.user){
            return Q(Rating.findByUserID(req.user.user_name, id));
        } else {
            return null;
        }
    })
    .then(function(prevRating){
        if(prevRating){
            lastRating = prevRating.rating;
        }
        res.render('object', {
            id: id,
            avgDisplay: avgVar,
            pic: pic,
            lastRating: lastRating
        });
    })
    .fail(function(err) {
        console.error(err);
        res.render('error', {
            title: 'An error occured while looking up ratings',
            message: 'The link you followed may be broken, or this page may ' +
                'have been deleted.'
        });
    })
    .done();
};
