var Q = require('q');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Board", {
        owner_name: {
            type: DataTypes.STRING(32),
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        },
        name: {
            type: DataTypes.STRING(64),
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 64
            }
        },
        description: {
            type: DataTypes.STRING(512),
            primaryKey: false,
            allowNull: false
        }
    }, {
        tableName: "Board",
        classMethods: {
            findByBoardAndUsername: function(user_name, board_name) {
                var query = { owner_name: user_name, name: board_name };
                return this.find({ where: query });
            },
            findByBoardName: function(board_name) {
                return this.findAll({ where: ["name LIKE ?", '%' + board_name + '%'] });
            },
            getPinnedObjects: function(board) {
                var query = 'SELECT * from Pin, Object ' + 
                            'WHERE Pin.user_name = :user_name ' + 
                            'AND   Pin.board_name = :board_name ' + 
                            'AND   Object.id = Pin.object_id ' +
                            'ORDER BY Pin.created_at DESC';
                var params = { user_name: board.owner_name, board_name: board.name };
                return Q(sequelize.query(query, null, { raw: true }, params));
            },
            changeBoardDescription: function(name, user, newDesc) {
               var query = "UPDATE Board " + 
                           "SET description = :description " +
                           "WHERE name = :name " +
                           "AND   owner_name = :user";
               var params = { name: name, user: user, description: newDesc };
               return sequelize.query(query, null, { raw: true }, params);
            }
        }
    });
};
