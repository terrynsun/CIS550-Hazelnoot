module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Interest', {
        user_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        }
    }, {
        tableName: 'Interest',
        timestamps: false
    });
}