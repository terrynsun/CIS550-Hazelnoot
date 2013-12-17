var Q = require('q');
var _ = require('underscore');
var cache = require('../cache');
var format = require('util').format;

var models = require('../models');
var Board = models.Board;
var Pin = models.Pin;
var Rating = models.Rating;
var PinObject = models.PinObject;
var Tags = models.Tags;
var sequelize = require('../app_config/sequelize');

var utils = require('../utils');

/*
 * GET /pin/new?url=<url>
 */
exports.newPinsPage = function(req, res) {
    var url = req.query.url;
    var user = req.user;
    if (!url) {
        req.flash('warning', 'Please provide a valid URL to pin.');
        res.redirect('/');
        return;
    }
    var acc = {};
    // Need: boards, pins (if they exist), actual Object itself (if it exists)

    Q(user.getBoards())
        .then(function(boards) {
            acc.boards = boards;
            return Q(Pin.allByURL(url));
        })
        .then(function(rows) {
            if (rows.length == 0) {
                var type = utils.isImage(url) ? "photo" : "object";
                res.render('pin/new', {
                    title: 'New pin',
                    url: url,
                    flash_messages: {info: ["Hey there! You're the first to pin this!"]},
                    boards: acc.boards,
                    objectType: type
                });
            } else {
                var objectId = rows[0].id;
                var objectType = rows[0].type;
                return Q(Tags.findAll({ where: { object_id: objectId } }))
                    .then(function(tags) {
                        res.render('pin/new', {
                            title: 'New pin',
                            url: url,
                            pins: rows,
                            boards: acc.boards,
                            tags: _.map(tags, function(tag) { return tag.tag; }),
                            objectType: objectType
                        })
                    })
            }
        })
        .fail(function(err) {
            console.error(err);
            res.render_error("Oh noes! Something went wrong on our end. Please try again " +
                "later after we get this sorted out.");
        })
        .done();
};


var CACHE_THRESHOLD = 5;

var cacheObject = function(pinObject) {
    Q(pinObject.pinCount())
        .then(function(rows) {
            var count = rows[0].count;
            if (count >= CACHE_THRESHOLD) {
                cache.store(pinObject.url)
                    .then(function() {
                        pinObject.is_cached = true;
                        return Q(pinObject.save());
                    })
                    .then(function() {
                        console.log("Cached " + pinObject.url);
                    })
                    .fail(function(err) {
                        console.error(err);
                        console.error('Caching oops');
                    })
                    .done();
            }
        })
        .done();
};

/*
 * POST /pin/new
 */
exports.newPin = function(req, res) {
    var url = req.body.url;
    var board_name = req.body.board_name;
    var description = req.body.description;
    var tags = (req.body.tags || '').split(' ');

    sequelize.transaction({
        isolationLevel: 'READ UNCOMMITTED'  // TODO: replace with Transaction constant
    }, function(transaction) {

        var rollback = function(err) {
            console.error(err);
            transaction.rollback();
            res.render_error("We couldn't make your pin. Try again later. :(");
        };
        Q(PinObject.findOrCreateByURL(url))
            .then(function(pinObject) {
                return Q(Board.findByBoardAndUsername(req.user.user_name, board_name))
                    .then(function(board) {
                        return Pin.create({
                            user_name: req.user.user_name,
                            object_id: pinObject.id,
                            board_name: board_name,
                            description: description
                        });
                    })
                    .then(function(pin) {
                        // Adding tags will not be part of this transaction
                        transaction.commit();

                        var performRedirect = function() {
                            req.flash('success', 'Successfully pinned!');
                            res.redirect(format('/pin/%s/%s/%s/%d',
                                req.user.user_name,
                                board_name,
                                'Hazelnoot',
                                pinObject.id
                            ));
                        };

                        // Attempt to add tags in bulk (try it all and ask for forgiveness
                        // TODO: later on, add the difference instead
                        var bulkTags = _.map(tags, function(tag) {
                            return { object_id: pinObject.id, tag: tag };
                        });

                        if (bulkTags.length > 0) {
                            Q(Tags.bulkCreate(bulkTags))
                                .finally(performRedirect);
                        } else {
                            performRedirect();
                        }

                        // Perform caching separately
                        if (!pinObject.is_cached) {
                            process.nextTick(cacheObject.bind(null, pinObject));
                        }
                    })
                    .fail(rollback);
            })
            .fail(rollback)
            .done();
    });
};

var getURL = function(obj) {
    if (obj.is_cached) {
        return '/cached/retrieve?url=' + obj.url;
    } else{
        return obj.url;
    }
};

/*
 * GET /pin/:user_name/:board_name/:source/:object_id
 *
 * pin display page
 */
exports.getPin = function(req, res) {
    var user_name = req.params.user_name;
    var board_name = req.params.board_name;
    var source = req.params.source;
    var object_id = parseInt(req.params.object_id, 10);
    var avgRating, lastRated;

    Q(Rating.getAverage(object_id, source))
    .then(function(avgResult) {
        avgRating = avgResult[0] ? avgResult[0].avg : 0;
        return Q(Rating.findByUserID(req.user.user_name, object_id, source));
    })
    .then(function(lastRated) {
        lastRated = lastRated;
        return Q(Pin.findByKeys(user_name, board_name, source, object_id))
    })
    .then(function(pin) {
        return Tags.findAll({ where: { object_id: object_id, source: source } })
        .then(function(tags) {
            res.render('pin/pin', {
                board_name: board_name,
                description: pin.description,
                user_name: req.params.user_name,
                objectType: pin.type,
                object_created_at: pin.obj_created_at,
                pin_created_at: pin.pin_created_at,
                source: pin.source,
                tags: _.map(tags, function(tag) { return tag.tag; }),
                url: getURL(pin),
                rating_url: format('/rating/%s/%d', source, object_id),
                is_cached: pin.is_cached,
                avgDisplay: avgRating,
                lastRated: lastRated
            });
        });
    })
    .fail(function(err) {
        console.error(err);
        res.render_error('Uh oh! Something went wrong on our end.');
    })
    .done();
};

/*
 * POST /pin/remove
 */
exports.removePin = function(req, res) {
  var current_name = req.user.user_name;
  var board_name = req.body.board;
  var source = req.body.source;
  var object_id = req.body.obj_id;
  return Q(Pin.deleteWithName(current_name, board_name, source, object_id))
      .then(function() {
          req.flash('info', 'You have removed something from your board.');
          res.set('show-edit', true);
          return;
      })
      .fail(function(err) {
          console.error(err);
      })
      .done(function() {
          res.redirect('/user/' + current_name + '/' + board_name);
      });
};
