var Board = require('../models').Board;
var Q = require('q');
var sequelize = require('../app_config/sequelize');
var _ = require('underscore');

var renderBoard = function(board, res) {
    Board.getPinnedObjects(board)
    .then(function(pinnedObjects) {
        return res.render('user/board', {
            title: board.name,
            board: board,
            images: pinnedObjects
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
    Q(Board.findByBoardName(user_name, board_name))
    .then(function(board) {
        return renderBoard(board, res);
    })
    .fail(function(err) {
        console.error(err);
        res.render('error', {
            title: 'Sorry, this board is gone!',
            message: 'I guess someone ate it. Sorry. You should look at ' +
                'some gifs instead.'
        });
    })
    .done();
};

/*
 * POST /user/:user_name/:board_name/edit
 */
exports.edit = function(req, res) {
    var userName = req.params.user_name;
    var boardName = req.params.board_name;
    var newDescription = req.body.desc;
    Q(changeBoardDescription(boardName, userName, newDescription))
    .then(function() {
        res.redirect('/user/' + userName + '/' + boardName);
    })
    .fail(function(err) {
        console.error(err);
        res.render('error', {
            title: 'Sorry, something has gone wrong!',
            message: 'Something\'s going wrong on our end now.'
        });
    })
    .done();

};
