module.exports = function(sequelize, DataTypes) {
    return sequelize.define("PinObject", {
        id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false
        },
        other_id: DataTypes.INTEGER(11),
        source: DataTypes.STRING(32),
        type: {
            type: DataTypes.STRING(16),
            allowNull : false,
            validate:{
                notEmpty: true,
                max: 16
            }
        },
        url: {
            type: DataTypes.STRING(256),
            allowNull: false,
            validate: {
                isUrl: true,
                max: 256
            }
        }
    }, {
        tableName: "Object",
        timestamps: false
    })
};
