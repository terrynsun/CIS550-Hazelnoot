module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Pin', {
        user_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
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
        },
        time_created: DataTypes.DATE
    }, {
        tableName: "Pin"
    });
};
