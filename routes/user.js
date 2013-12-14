var bcrypt = require('bcrypt');
var Q = require('q');
var _ = require('underscore');

var User = require('../models').User;
var Board = require('../models').Board;
var Interest = require('../models').Interest;
var Pin = require('../models').Pin;

var render_user = function(user, res) {
    return Q(user.nsa())
        .then(function(info) {
            var interest_names = _.map(info.interests, function(interest) {
                return interest.name;
            });
            var friends_names = _.map(info.friends, function(friend) {
                return friend.name();
            });
            var board_names = _.map(info.boards, function(board) {
                return board.name;
            });

            res.render('user/profile', {
                title: user.full_name(),
                user: user,
                interests: interest_names,
                friends: friends_names,
                boards: board_names
            });
        })
        .fail(function(err) {
            console.error(err);
            res.render('error', {
                title: 'Oh noes!',
                message: 'Something went wrong on our end while loading this user. ' +
                    'Please try again later.'
            });
        });
};

/*
 * GET /user/:user_name
 */
exports.index = function(req, res) {
    var user_name = req.params.user_name;

    // micro-optimization so we don't have to fetch info about myself
    if (req.isAuthenticated() && user_name === req.user.user_name) {
        render_user(req.user, res).done();
    } else {
        Q(User.findByUsername(user_name))
            .then(function(user) {
                return render_user(user, res);
            })
            .fail(function(err) {
                res.render('error', {
                    title: 'Sorry, this user does not exist',
                    message: 'The link you followed may be broken, or this page may ' +
                        'have been deleted.'
                })
            })
            .done();
    }
};


/*
 * GET /user/me
 */
exports.me = function(req, res) {
    render_user(req.user, res).done();
};


var renderUserUpdate = function(current_user, res) {
    return Q(current_user.nsa())
        .then(function(info) {

            res.render('user/update', {
                title: 'Update your profile'
            });
        })
        .fail(function(err) {
            console.error(err);
            res.render('user/error', {
                title: 'Oh noes!',
                message: 'Something went wrong on our end while loading your account. ' +
                    'Please try again later.'
            });
        });
};

/*
 * GET /user/me/update
 */
exports.updateProfilePage = function(req, res) {
    renderUserUpdate(req.user, res).done();
};

/*
 * POST /user/me/update
 */
exports.updateProfile = function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var affiliation = req.body.affiliation;

    if(firstName) req.user.first_name = firstName;
    if(lastName) req.user.last_name = lastName;
    if(email) req.user.email = email;
    if(affiliation) req.user.affiliation = affiliation;

    Q(req.user.save())
        .then(function(user) {
            req.flash('success', 'Updated your profile.');
            return res.redirect('/user/me/update');
        })
        .fail(function(err) {
            console.error(err);
            req.flash('error', err.message);
            return res.redirect('/user/me/update');
        })
        .done();
};

/*
 * POST /user/me/update/password
 */
exports.updatePassword = function(req, res) {
    var oldPassword = req.body.old_password;
    var newPassword = req.body.new_password;
    var confirmPassword = req.body.new_password_confirm;

    var go_back = function(message, flash_type) {
        flash_type = flash_type || 'error';
        req.flash(flash_type, message);
        res.redirect('/user/me/update');
    };

    if (!(oldPassword && newPassword && confirmPassword)) {
        go_back('You need to fill out all password fields');
        return;
    }

    if (newPassword !== confirmPassword) {
        go_back('New passwords did not match.');
        return;
    }

    Q.nfcall(bcrypt.compare, oldPassword, req.user.password_hash)
        .then(function(res) {
            if (!res) {
                var e = new Error('Old password does not match');
                e.name = 'PEBKACError';
                throw e;
            }

            return Q.nfcall(bcrypt.hash, newPassword, 10);
        })
        .then(function(hash) {
            req.user.password_hash = hash;
            return Q(req.user.save());
        })
        .then(function() {
            // Success!
            go_back('Successfully updated your password!', 'success');
        })
        .fail(function(err) {
            if (err.name === 'PEBKACError') {
                go_back(err.message);
            } else {
                go_back('Something went wrong on our end :(');
            }
        })
        .done();
};


var renderUserInterests = function(current_user, res) {
    return Q(current_user.nsa())
        .then(function(info) {
            var interest_names = _.map(info.interests, function(interest) {
                return interest.name;
            });
            res.render('user/interests', {
                title: 'Your Interests',
                interests: interest_names
            });
        })
        .fail(function(err) {
            console.error(err);
            res.render('user/error', {
                title: 'Oh noes!',
                message: 'Something went wrong on our end while loading your interests. ' +
                    'Please try again later.'
            });
        });
};            

/*
 * GET user/me/interests
 */
exports.updateInterestsPage = function(req, res) {
    renderUserInterests(req.user, res).done();
};


/*
 * POST user/me/interests/add
 */

exports.updateInterestsAdd = function(req, res) {
    var newInterest = req.body.newInterest;
    var current_name = req.user.user_name;

    return Q(Interest.findByUserInterest(current_name, newInterest))
    .then(function(wasThere) {
        if(wasThere) {
            var e = new Error('You are already interested in that.');
            e.name = 'AlreadyInterestedError';
            throw e;
        }
        var interest = Interest.build({
            user_name: current_name,
            name: newInterest
        });
        return Q(interest.save());
    })
    .then(function(interest) {
        req.flash('info', 'You\'re now interested in ' + interest.name + ' !');
        return;
    })
    .fail(function(err) {
        console.error(err);
        req.flash('error', err.message);
        return;
    })
    .done(function() {
        res.redirect('/user/me/interests');
        return;
    });
    
};



/* 
 * POST user/me/interests/remove
 */

exports.updateInterestsRemove = function(req, res) {
    var oldInterest = req.body.oldInterest;
    var current_name = req.user.user_name;

    return Q(Interest.findByUserInterest(current_name, oldInterest))
    .then(function(removed) {
        removed.destroy();
        req.flash('info', 'You have removed ' + oldInterest + ' from your interests.');
        return;
    })
    .fail(function(err) {
        console.error(err);
        req.flash('error'. err.message);
        return;
    })
    .done(function() {
        res.redirect('/user/me/interests');
        return;
    });
};



var renderUserBoard = function(current_user, res) {
    return Q(current_user.nsa())
    .then(function(info) {
        var board_names = _.map(info.boards, function(board) {
            return board.name;
        });
        res.render('user/editBoards', {
            title: 'Your Boards',
            boards: board_names
        });
    })
    .fail(function(err) {
        console.error(err);
        res.render('user/error', {
            title: 'Oh noes!',
            message: 'Something went wrong on our end while loading your interests. ' +
                'Please try again later.'
        });
    });
};

/*
 * GET user/me/boards
 */
exports.updateBoardPage = function(req, res) {
    renderUserBoard(req.user, res).done();
};


/*
 * POST user/me/boards/add
 */

exports.updateBoardAdd = function(req, res) {
    var newBoard = req.body.newBoard;
    var current_name = req.user.user_name;

    return Q(Board.findByBoardName(current_name, newBoard))
    .then(function(wasThere) {
        if(wasThere) {
            var e = new Error('You already have a board named that.');
            e.name = 'AlreadyOwnBoardError';
            throw e;
        }
        var board = Board.build({
            owner_name: current_name,
            name: newBoard
        });
        return !(board.save());
    })
    .then(function(board) {
        req.flash('info', 'You\'ve made ' + board.name + ', a new board!');
        return;
    })
    .fail(function (err) {
        console.error(err);
        req.flash('error', err.message);
        return;
    })
    .done(function() {
        res.redirect('/user/me/boards');
        return;
    });
};


/*
 * POST user/me/boards/remove
 */
exports.updateBoardRemove = function(req, res) {
    var oldBoard = req.body.oldBoard;
    var current_name = req.user.user_name;

    return Q(Pin.deleteFromBoard(current_name, oldBoard))
    .then(function(removedPins) {
        return Q(Board.findByBoardName(current_name, oldBoard));
    })
    .then(function(removedBoard) {
        removedBoard.destroy();
        req.flash('info', 'You have removed ' + oldBoard + ' from your boards.');
        return;
    })
    .fail(function(err) {
        console.error(err);
        req.flash('error'. err.message);
        return;
    })
    .done(function() {
        res.redirect('/user/me/boards');
        return;
    });
};

