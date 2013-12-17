var sequelize = require('../app_config/sequelize');

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
        source: {
            type: DataTypes.STRING(32),
            allowNull: false,
            defaultValue: 'Hazelnoot'
        },
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
            findByKeys: function(user_name, board_name, source, object_id) {
                var query = 'SELECT O.source, O.type, O.url, ' +
                    'O.created_at AS obj_created_at, P.description, ' +
                    'P.created_at AS pin_created_at, P.updated_at ' +
                    'FROM Pin P, Object O ' +
                    'WHERE P.object_id = O.id AND P.source = O.source ' +
                    'AND P.user_name = ? AND P.board_name = ? AND P.source = ? AND P.object_id = ?';
                var queryParams = [user_name, board_name, source, object_id];
                return sequelize.query(query, null, {raw: true}, queryParams)
                    .then(function(rows) {
                        if (rows.length != 1) {
                            var e = new Error('Unexpected result from query');
                            e.name = 'InvalidRowNumberError';
                            throw e;
                        }
                        var pin = rows[0];
                        return pin;
                    });
            },

            allByURL: function(url) {
                var query = 'SELECT O.id, O.source, O.type, O.url, ' +
                    'O.created_at AS obj_created_at, P.user_name, P.board_name,' +
                    'P.created_at, P.updated_at, P.description ' +
                    'FROM Object O, Pin P ' +
                    'WHERE O.url = ? AND O.id = P.object_id';
                var queryParams = [url];
                return sequelize.query(query, null, {raw: true}, queryParams);
            },

            deleteWithName: function(user_name, board_name, object_id) {
                var query = 'DELETE FROM Pin ' +
                            'WHERE user_name = :name ' +
                            'AND   board_name = :board ' +
                            'AND   object_id = :obj_id';
                var params = { name: user_name, board: board_name, obj_id: object_id };
                return sequelize.query(query, null, { raw: true }, params);
            },
            deleteFromBoard: function(user_name, board_name) {
                var query = 'DELETE FROM Pin ' +
                            'WHERE user_name = :name ' +
                            'AND board_name = :board';
                var params = { name: user_name, board: board_name };
                return sequelize.query(query, null, { raw: true }, params);
            }
        }
    });
};
