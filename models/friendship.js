module.exports = function(sequelize, DataTypes) {
    return sequelize.define("Friendship", {
        user_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        },
        friend_name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 32
            }
        }
    }, {
        tableName: "Friendship",

        instanceMethods: {
            name: function() {
                return this.friend_name;
            }
        }
    });
};
