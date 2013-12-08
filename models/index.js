var sequelize = require('../app_config/sequelize');

var User = sequelize.import(__dirname + '/user');
var PinObject = sequelize.import(__dirname + '/object');
var Interest = sequelize.import(__dirname + '/interest');
var Friendship = sequelize.import(__dirname + '/friendship');
var Board = sequelize.import(__dirname + '/board');
var Rating = sequelize.import(__dirname + '/rating');
var Pin = sequelize.import(__dirname + '/pin');
var Tags = sequelize.import(__dirname + '/tags');

User.hasMany(Interest, {
    as: 'Interests',
    foreignKey: 'user_name'
});
User.hasMany(Friendship, {
    as: 'Friends',
    foreignKey: 'user_name'
});
User.hasMany(Board, {
    as: 'Boards',
    foreignKey: 'owner_name'
});
User.hasMany(Rating, {
    as: 'Ratings',
    foreignKey: 'user_name'
}),
User.hasMany(Pin, {
    as: 'Pin',
    foreignKey: 'user_name'
});

PinObject.hasMany(Rating, {
    as: 'Ratings',
    foreignKey: 'object_id'
});
PinObject.hasMany(Pin, {
    as: 'Pin',
    foreignKey: 'object_id'
});
PinObject.hasMany(Tags, {
    as: 'Tags',
    foreignKey: 'object_id'
});

/* Let's pretend this is actual code n' stuff.
Board.hasMany(Pin, {
    as: 'Pin',
    foreignKey: 'user_name',
    foreignKey: 'board_name'
});
*/


exports.User = User;
exports.PinObject = PinObject;
exports.Interest = Interest;
exports.Friendship = Friendship;
exports.Board = Board;
exports.Rating = Rating;
exports.Pin = Pin;
exports.Tags = Tags;
