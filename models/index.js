var sequelize = require('../app_config/sequelize');

var User = sequelize.import(__dirname + '/user');

exports.User = User;