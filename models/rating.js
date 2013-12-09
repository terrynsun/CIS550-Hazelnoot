var Q = require('q');
var sequelize = require('../app_config/sequelize');
var Rating = require('../models').Rating;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Rating", {
        object_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING(32),
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        },
        rating: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        }
    }, {
        tableName: 'Rating',
        classMethods: {
            getAverageByID: function(lookup_id) {
                var query = 'SELECT AVG(rating) AS avg ' +
                    'FROM Rating ' +
                    'GROUP BY object_id ' +
                    'HAVING object_id = :id';
                var params = { id: lookup_id };
                return Q(sequelize.query(query, null, { raw: true }, params));
                }
            },
            findByUserID: function(user_name, object_id) {
                return Q(this.find({ where: { object_id: object_id, user_name: user_name } }));
            }
    });
};
