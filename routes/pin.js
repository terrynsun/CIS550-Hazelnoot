var Q = require('q');
var _ = require('underscore');

var models = require('../models');
var Board = models.Board;
var Pin = models.Pin;
var PinObject = models.PinObject;
var Tags = models.Tags;

var utils = require('../utils');

/*
 * GET /pin/new?url=<url>
 */
exports.newPinsPage = function(req, res) {
    var url = req.query.url;
    if (!url) {
        req.flash('warning', 'Please provide a valid URL to pin.');
        res.redirect('/');
        return;
    }

    PinObject.findByURL(url)
        .then(function(pinObject) {
            Q(pinObject.getTags())
                .then(function(tags) {
                    res.render('pin/new', {
                        title: 'New pin',
                        url: url,
                        pins: [],
                        tags: _.map(tags, function(tag) { return tag.tag; }),
                        objectType: pinObject.type
                    });
                })
                .fail(function(err) {
                    res.render('pin/new', {
                        title: 'New pin',
                        flash_messages: {error: ['Failed to lookup tags']},
                        url: url,
                        pins: [],
                        objectType: pinObject.type
                    });
                })
                .done();
        })
        .fail(function(err) {
            var type = utils.isImage(url) ? "image" : "object";
            res.render('pin/new', {
                title: 'New pin',
                flash_messages: {info: ["Hey there! You're the first to pin this!"]},
                url: url,
                objectType: type
            });
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

    PinObject.findOrCreateByURL(url)
        .then(function(pinObject) {
            return Q(Tags.bulkCreate(_.map(tags, function(tag) {
                return { object_id: pinObject.id, tag: tag };
            })))
                .then(function() {
                    return Board.findByBoardName(req.user.user_name, board_name);
                })
                .then(function(board) {
                    return Pin.create({
                        user_name: req.user.user_name,
                        object_id: pinObject.id,
                        board_name: board_name,
                        description: description
                    })
                })
                .then(function(pin) {
                    res.send(200, "Successfully created pin");
                })
                .fail(function(err) {
                    console.error(err);
                    res.send(500, "Failed to pin");
                })
        })
        .fail(function(err) {
            console.error('WTF?');
            console.error(err);
            res.send(500, "Internal server error");
        })
        .done();
};

/*
 * GET /pin/:user_name/:board_name/:object_id
 */
exports.getPin = function(req, res) {
    var user_name = req.params.user_name;
    var board_name = req.params.board_name;
    var object_id = parseInt(req.params.object_id, 10);

    Pin.findWithObject(user_name, board_name, object_id)
        .then(function(pin) {
            return Tags.findAll({ where: { object_id: object_id } })
                .then(function(tags) {
                    res.render('pin/pin', {
                        board_name: board_name,
                        description: pin.description,
                        objectType: pin.type,
                        object_created_at: pin.obj_created_at,
                        pin_created_at: pin.pin_created_at,
                        source: pin.source,
                        tags: _.map(tags, function(tag) { return tag.tag; }),
                        url: pin.url
                    });
                });
        })
        .fail(function(err) {
            console.error(err);
            res.render_error('Uh oh! Something went wrong on our end.');
        })
        .done();
};
