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
            findByBoardName: function(user_name, board_name) {
                var query = { owner_name: user_name, name: board_name };
                return this.find({ where: query });
            }
        }
    });
};
