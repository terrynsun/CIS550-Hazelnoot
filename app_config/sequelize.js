var Sequelize = require('sequelize');

require('js-yaml');
var dbConfig = require('../config/db.yaml').mysql;

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.hostname,
    dialect: 'mysql',

    // Don't add updatedAt/createdAt
    timestamps: false,

    // Sequelize does opinionated stuff with table names. Disable that shit
    freezeTableName: true
});

module.exports = sequelize;