var Q = require('q');

var models = require('../models');
var Board = models.Board;
var Pin = models.Pin;
var PinObject = models.PinObject;

/*
 * GET /pin/new?url=<url>
 */
exports.newPinsPage = function(req, res) {
    var url = req.query.url;
    PinObject.findByURL(url)
        .then(function(pinObject) {
            res.render('pin/new', {
                title: 'New pin',
                url: url,
                pins: [],
                type: pinObject.type,
                current_user: req.user
            });
        })
        .fail(function(err) {
            res.render('pin/new', {
                title: 'New pin',
                url: url,
                current_user: req.user
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

    PinObject.findOrCreateByURL(url)
        .then(function(pinObject) {
            return Board.findByName(req.user.user_name, board_name)
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
                .done();
        })
        .fail(function(err) {
            console.error('WTF?');
            console.error(err);
            res.send(500, "Internal server error");
        })
        .done();
};
