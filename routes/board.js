var User  = require('../models').User;
var Pin   = require('../models').Pin;
var PinObject   = require('../models').PinObject;
var Board = require('../models').Board;
var Q = require('q');
var sequelize = require('../app_config/sequelize');
var _ = require('underscore');

// don't mind this function awkwardly being in this place
var getPinnedObjects = function(board) {
    var query = 'SELECT * from Pin, Object ' + 
                 'WHERE Pin.user_name = :user_name ' + 
                 'AND   Pin.board_name = :board_name ' + 
                 'AND   Object.id = Pin.object_id';
    var parms = { user_name: board.owner_name, board_name: board.name };
    // of the chicken variety (because my typo deserves to live)
    return Q(sequelize.query(query, Pin, PinObject, parms));
};

var renderBoard = function(board, current_user, res) {
    getPinnedObjects(board)
    .then(function(pinnedObjects) {
        var boardObjects = _.map(pinnedObjects, function(obj) {
            return obj.dataValues;
        });
        return res.render('user/board', {
            title: board.name,
            current_user: current_user,
            board: board,
            images: boardObjects
        });
    })
    .done();
};

/*
 * GET /user/:user_name/:board_name
 */
exports.index = function(req, res) {
    var user_name = req.params.user_name;
    var board_name = req.params.board_name;
    console.log(req.user);
    Board.findByName(user_name, board_name)
    .then(function(board) {
        return renderBoard(board, req.user, res);
    })
    .fail(function(err) {
        res.render('error', {
            title: 'Sorry, this board is gone!',
            current_user: req.user,
            message: 'I guess someone ate it. Sorry. You should look at ' +
                'some gifs instead.'
        })
    })
    .done();
};
