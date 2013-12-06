var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        first_name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING(32),
            primaryKey: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(64),
            unique: true,
            allowNull: false
        },
        affiliation: DataTypes.STRING(64),
        password_hash: DataTypes.STRING(60),
        birthday: DataTypes.DATE
    }, {
        tableName: 'Users'
    })
};