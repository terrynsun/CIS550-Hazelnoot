var sequelize = require('../app_config/sequelize');

var User = sequelize.import(__dirname + '/user');
var Object = sequelize.import(__dirname + '/object');
var Interest = sequelize.import(__dirname + '/interest');

User.hasMany(Interest, {
    as: 'Interests',
    foreignKey: 'user_name'
});

exports.User = User;
exports.Object = Object;
exports.Interest = Interest;