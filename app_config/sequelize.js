var Sequelize = require('sequelize');

require('js-yaml');
var dbConfig = require('../config/db.yaml').mysql;

var sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.hostname,
    dialect: 'mysql',

    define: {
        // Don't add updatedAt/createdAt
        freezeTableName: true,
        timestamps: false
    },

    native: true,
    syncOnAssociation: false
});

module.exports = sequelize;