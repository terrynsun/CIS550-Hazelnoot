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
        time_created: DataTypes.DATE
    })
};
