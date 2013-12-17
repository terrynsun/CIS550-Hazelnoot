var sequelize = require('../app_config/sequelize');
var Rating = require('../models').Rating;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Rating", {
        object_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false
        },
        source: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: 'Hazelnoot'
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
            getAverage: function(lookup_id, source) {
                var query = 'SELECT AVG(rating) AS avg ' +
                    'FROM Rating ' +
                    'WHERE object_id = :id AND source = :source ' +
                    'GROUP BY object_id';
                var params = { id: lookup_id, source: source };
                return sequelize.query(query, null, { raw: true }, params);
            },
            findByUserID: function(user_name, object_id, source) {
                return this.find({ where: {
                    object_id: object_id,
                    source: source,
                    user_name: user_name }
                });
            }
        }
    });
};
