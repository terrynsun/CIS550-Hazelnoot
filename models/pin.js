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
        tableName: "Pin"
    });
};
