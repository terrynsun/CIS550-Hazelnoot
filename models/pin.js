var sequelize = require('../app_config/sequelize');
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
            findByKeys: function(user_name, board_name, object_id) {
                var query = 'SELECT O.source, O.type, O.url, ' +
                    'O.created_at AS obj_created_at, P.description, ' +
                    'P.created_at AS pin_created_at, P.updated_at ' +
                    'FROM Pin P, Object O ' +
                    'WHERE P.object_id = O.id ' +
                    'AND P.user_name = ? AND P.board_name = ? AND P.object_id = ?';
                var queryParams = [user_name, board_name, object_id];
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
            },
            getFriendPins: function(username, n) {
                var query = 'SELECT * FROM Object, Pin, Friendship ' +
                            'WHERE Friendship.user_name = :name ' +
                            'AND Friendship.friend_name = Pin.user_name ' +
                            'AND Pin.object_id = Object.id ' +
                            'ORDER BY Pin.created_at DESC ' +
                            'LIMIT :num';
                var parms = { name: username, num: n };
                return Q(sequelize.query(query, null, { raw: true }, parms));
            },
            getNewest: function(n) {
                var query = 'SELECT * FROM Pin, Object ' +
                            'WHERE Pin.object_id = Object.id ' +
                            'ORDER BY Pin.created_at DESC ' +
                            'LIMIT :num';
                var parms = { num: n };
                return Q(sequelize.query(query, null, { raw: true }, parms));
            },
            getByUserInterest: function(username, n) {
                var query = 'SELECT * FROM Object, Tags, Interest ' +
                    'WHERE Interest.user_name = :name ' +
                    'AND   Tags.tag = Interest.name ' +
                    'AND   Tags.object_id = Object.id ' +
                    'ORDER BY Object.created_at DESC ' +
                    'LIMIT :num';
                var parms = { name: username, num:n };
                return Q(sequelize.query(query, null, { raw: true }, parms));
            }
        }
    })
};
