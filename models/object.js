var Q = require('q');

var utils = require('../utils');

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

        classMethods: {
            findByURL: function(url) {
                return Q(this.find({ where: { url: url } }));
            },
            findOrCreateByURL: function(url) {
                var type = 'object';
                if (utils.isImage(url)) {
                    type = 'image';
                }
                var deferred = Q.defer();
                var self = this;
                console.log("findOrCreateByURL");

                self.find({ where: { url: url } })
                    .success(function(obj) {
                        if (obj) {
                            deferred.resolve(obj);
                        }

                        self.create({ url: url, type: type })
                            .success(function() {
                                self.find({ where: { url: url } })
                                    .success(function(obj){
                                        if (obj) {
                                            deferred.resolve(obj);
                                        } else {
                                            deferred.reject(new Error('Null object'));
                                        }
                                    })
                                    .failure(function(err) {
                                        deferred.reject(err);
                                    })
                            })
                            .failure(function(err) {
                                deferred.reject(err);
                            })
                    })
                    .failure(function(err) {
                        deferred.reject(err);
                    });

                return deferred.promise;
            },
            findByID: function(id) {
                return Q(this.find({ where: { id: id } }));
            }
        }
    })
};
