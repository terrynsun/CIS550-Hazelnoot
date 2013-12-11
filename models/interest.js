var Q = require('q');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Interest', {
        user_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
                max: 32
            }
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
                max: 32
            }
        }
    }, {
        tableName: 'Interest',
        classMethods: {
            findByUser: function(userName) {
                var query = 'SELECT name ' +
                    'FROM Interest ' +
                    'WHERE user_name = ?';
                var queryParams = [userName];
                return Q(sequelize.query(query, null, {raw: true}, queryParams));
            },
            findByInterest: function(interest) {
                var query = 'SELECT user_name ' +
                    'FROM Interest ' +
                    'WHERE name = ?';
                var queryParams = [interest];
                return Q(sequelize.query(query, null, {raw: true}, queryParams));
            },
            findByUserInterest: function(userName, interest) {
                var query;
                query = ["user_name = ? AND name = ?", userName, interest];
                return Q(this.find({ where: query }));
            }
        }
    });
}
