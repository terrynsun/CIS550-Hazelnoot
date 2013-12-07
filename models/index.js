var sequelize = require('../app_config/sequelize');

var User = sequelize.import(__dirname + '/user');
var PinObject = sequelize.import(__dirname + '/object');
var Interest = sequelize.import(__dirname + '/interest');
var Friendship = sequelize.import(__dirname + '/friendship');
var Board = sequelize.import(__dirname + '/board');
var Rating = sequelize.import(__dirname + '/rating');

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
PinObject.hasMany(Rating, {
    as: 'Ratings',
    foreignKey: 'object_id'
});


exports.User = User;
exports.PinObject = Object;
exports.Interest = Interest;
exports.Board = Board;
exports.Rating = Rating;
