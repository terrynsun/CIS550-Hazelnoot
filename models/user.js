var Q = require('q');

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
        birthday: DataTypes.DATE,
        time_created: DataTypes.DATE
    }, {
        tableName: 'Users',
        classMethods: {
            exists: function(user_name, email) {
                var query;

                if (!email) {
                    query = { user_name: user_name };
                } else if (!user_name) {
                    query = { email: email };
                } else {
                    query = ["user_name = ? OR email = ?", user_name, email];
                }
                return Q(this.findAll({ where: query }));
            },

            findByUsername: function(user_name) {
                return Q(this.find({ where: { user_name: user_name } }));
            }
        },
        instanceMethods: {
            // Gets all information about a user (HAHA I get the joke. -Richie)
            nsa: function() {
                // Accumulating dictionary.
                // Do not modify outside of the promise chain
                var acc = {};
                var self = this;
                return Q(self.getInterests())
                    .then(function(interests) {
                        acc.interests = interests;
                        return Q(self.getFriends());
                    })
                    .then(function(friends) {
                        acc.friends = friends;
                        return Q(self.getBoards());
                    })
                    .then(function(boards) {
                        acc.boards = boards;
                        return acc;
                    });
            },

            // Gets the full name
            full_name: function() {
                return this.first_name + ' ' + this.last_name
            }
        }
    });
};
