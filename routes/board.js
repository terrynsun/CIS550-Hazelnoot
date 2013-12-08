var User = require('../models').User;
var Board = require('../models').Board;
var Q = require('q');

var render_board = function(user, board, res) {
    return res.render('boards/board', {
      board_owner: user,
      board: board
    });
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
                return render_board(user, board, res);
             })
         });
};
