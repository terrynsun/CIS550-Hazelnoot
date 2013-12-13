var Q = require('q');
var _ = require('underscore');
var format = require('util').format;

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
    var user = req.user;
    if (!url) {
        req.flash('warning', 'Please provide a valid URL to pin.');
        res.redirect('/');
        return;
    }
    var pin;
    var acc = {};

    PinObject.findByURL(url)
    .then(function(pinObject) {
        pin = pinObject;
        return Q(pinObject.getPins());
    })
    .then(function(pins) {
        acc.pins = pins;
        return Q(user.getBoards());
    })
    .then(function(boards) {
        acc.boards = boards;
        return Q(pin.getTags())
    })
    .then(function(tags) {
        res.render('pin/new', {
            title: 'New pin',
            url: url,
            pins: acc.pins,
            boards: acc.boards,
            tags: _.map(tags, function(tag) { return tag.tag; }),
            objectType: pin.type
        });
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
        var bulkTags = _.map(tags, function(tag) {
            return { object_id: pinObject.id, tag: tag };
        });

        if(req.body.tags)
            return Q(Tags.bulkCreate(bulkTags))
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
            req.flash('success', 'Successfully pinned!');
            res.redirect(format('/pin/%s/%s/%d',
                req.user.user_name,
                board_name,
                pinObject.id
            ));
        })
        .fail(function(err) {
            console.error("****\nerror 1 ", err);
            res.render_error("We couldn't make your pin. Ya dingus.");
        })
    })
    .fail(function(err) {
        res.render_error("We couldn't make your pin. Try again later. :(");
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

/*
 * POST /pin/remove
 */
exports.removePin = function(req, res) {
  var current_name = req.user.user_name;
  var board_name = req.body.board;
  var object_id = req.body.obj_id;
  console.log(current_name, board_name, object_id);
  return Q(Pin.deleteWithName(current_name, board_name, object_id))
      .then(function() {
          req.flash('info', 'You have removed something from your board.');
          return;
      })
      .fail(function(err) {
          console.error(err);
      })
      .done(function() {
          res.redirect('/user/' + current_name + '/' + board_name);
      });
};
