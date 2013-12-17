var Q = require('q');

var models = require('../models');
var Rating = models.Rating;


/*
 *  POST /rating/:id
 */
exports.changeRating = function(req, res) {
    var id = req.params.id;
    var rating = req.body.rating;
    var userName = req.user.user_name;

    Q(Rating.findByUserID(userName, id))
        .then(function (oldRating) {
            if(!oldRating){
                oldRating = Rating.build({
                    user_name: userName,
                    object_id: id
                });
            }

            oldRating.rating = rating;

            return Q(oldRating.save());
        })
        .then(function() {
            res.json(200, { success: true });
        })
        .fail(function(err) {
            console.error(err);
            res.json(500, { success: false });
        })
        .done();
};