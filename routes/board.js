var User  = require('../models').User;
var Pin   = require('../models').Pin;
var PinObject   = require('../models').PinObject;
var Board = require('../models').Board;
var Q = require('q');
var sequelize = require('../app_config/sequelize');
var _ = require('underscore');

var getPinnedObjects = function(board) {
    var query = 'SELECT * from Pin, Object ' + 
                 'WHERE Pin.user_name = :user_name ' + 
                 'AND   Pin.board_name = :board_name ' + 
                 'AND   Object.id = Pin.object_id';
    var parms = { user_name: board.owner_name, board_name: board.name };
    // of the chicken variety (because my typo deserves to live)
    console.log(parms);
    return Q(sequelize.query(query, Pin, PinObject, parms ));
};

var renderBoard = function(user, board, res) {
    getPinnedObjects(board)
    .then(function(pinnedObjects) {
        var boardObjects = _.map(pinnedObjects, function(obj) {
            return obj.dataValues;
        });
        console.log(boardObjects);
        return res.render('user/board', {
            board_owner: user,
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
    Board.findByName(user_name, board_name)
         .then(function(board) {
             User.findByUsername(user_name) 
                 .then(function(user) {
                return renderBoard(user, board, res);
             })
             .done()
         })
         .done();
};
