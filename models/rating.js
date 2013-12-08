module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Rating", {
        object_id: {
            type: DataTypes.INTEGER(11),
            primaryKey: true,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING(32),
            primaryKey: true,
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        },
        rating: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        time_created: DataTypes.DATE
    }, {
        tableName: 'Rating'
    });
};
