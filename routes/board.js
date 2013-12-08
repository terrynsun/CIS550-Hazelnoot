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

var renderBoard = function(board, res) {
    getPinnedObjects(board)
    .then(function(pinnedObjects) {
        var boardObjects = _.map(pinnedObjects, function(obj) {
            return obj.dataValues;
        });
        return res.render('user/board', {
            title: board.name,
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
    Board.findByBoardName(user_name, board_name)
    .then(function(board) {
        return renderBoard(board, res);
    })
    .fail(function(err) {
        res.render('error', {
            title: 'Sorry, this board is gone!',
            message: 'I guess someone ate it. Sorry. You should look at ' +
                'some gifs instead.'
        })
    })
    .done();
};
