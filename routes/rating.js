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
exports.rating = function(req, res) {
    var id = req.params.id;
    var avgVar;
    var pic;
    var lastRating = 0;

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
        if(curObj){
            if(avgVar[0]){
                avgVar = avgVar[0].avg;
            }
            else{
                avgVar = 0;
            }
            pic = curObj.url;
        }
        else{
            res.render('error', {
                title: 'This photo doesn\'t appear to exist!',
                message: 'The link you followed may be broken, or this page may ' +
                    'have been deleted.'
            })
            .done();
        }

        if(req.user){
            return(Rating.findByUserID(req.user.user_name, id));
        }
        else{
            return(null);
        }
    })
    .then(function(prevRating){
        if(prevRating){
            lastRating = prevRating.rating;
        }
        res.render('rating', {
            id: id,
            avgDisplay: avgVar,
            pic: pic,
            lastRating: lastRating
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


/*
 *  POST /rating/:id
 */
exports.changeRating = function(req, res) {

    /*TODO ID = ':id' ALWAYS. How can we get the actual object id? */

    var id = req.params.id;
    var userName = req.user.user_name;

    Rating.findByUserID(userName, id)
    .then(function (oldRating) {
        if(!oldRating){
            var oldRating = Rating.build({
                user_name: userName,
                object_id: id
            });
        }

        /*TODO Fix this to get the actual rating and not just 1! */
        oldRating.rating = 1;

        return Q(oldRating.save());
    })
    .fail(function(err) {
        console.log(err);
        res.render('error', {
            title: 'An error occured while rating this object.',
            message: 'The link you followed may be broken, or this page may ' +
                'have been deleted.'
        });
    })
    .done();

};
