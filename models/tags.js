module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Tags", {
        object_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        tag: {
            type: DataTypes.STRING(64),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 64
            }
        },
        time_created: DataTypes.DATE
    }, {
        tableName: "Tags"
    });
};
