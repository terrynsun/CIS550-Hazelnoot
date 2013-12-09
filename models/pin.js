var Q = require('q');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Pin', {
        user_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            },

            // IGNORE THIS.
            // Sequelize is kinda opinionated. If you don't define a primary key, it
            // will just assume that you want an ID column >_>
            primaryKey: true
        },
        object_id: DataTypes.INTEGER(11),
        board_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 64
            }
        },
        description: {
            type: DataTypes.STRING(512),
            validate: {
                max: 512
            }
        }
    }, {
        tableName: "Pin",
        classMethods: {
            findWithObject: function(user_name, board_name, object_id) {
                var query = 'SELECT O.source, O.type, O.url, ' +
                    'O.created_at AS obj_created_at, P.description, ' +
                    'P.created_at AS pin_created_at, P.updated_at ' +
                    'FROM Pin P, Object O ' +
                    'WHERE P.object_id = O.id ' +
                    'AND P.user_name = ? AND P.board_name = ? AND P.object_id = ?';
                var queryParams = [user_name, board_name, object_id];
                return Q(sequelize.query(query, null, {raw: true}, queryParams))
                    .then(function(rows) {
                        if (rows.length != 1) {
                            var e = new Error('Unexpected result from query');
                            e.name = 'InvalidRowNumberError';
                            throw e;
                        }
                        var pin = rows[0];
                        return pin;
                    });
            }
        }
    });
};
