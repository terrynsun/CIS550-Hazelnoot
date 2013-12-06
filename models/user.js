var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("User", {
        first_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        },
        last_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
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
        email: {
            type: DataTypes.STRING(64),
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true,
                max: 64
            }
        },
        affiliation: DataTypes.STRING(64),
        password_hash: {
            type: DataTypes.STRING(60),
            allowNull: false,
            validate: {
                min: 60,
                max: 60
            }
        },
        birthday: DataTypes.DATE
    }, {
        tableName: 'Users'
    })
};