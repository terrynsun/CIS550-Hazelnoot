var sequelize = require('../app_config/sequelize');

var User = sequelize.import(__dirname + '/user');
var Object = sequelize.import(__dirname + '/object');

exports.User = User;
exports.Object = Object;