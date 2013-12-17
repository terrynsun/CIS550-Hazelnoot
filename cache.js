var GridStore = require('mongodb').GridStore;
var http = require('http');
var Q = require('q');
var request = require('request');

var read_connect = require('./app_config/mongo').read_connect;
var write_connect = require('./app_config/mongo').write_connect;


var httpGet = function(url) {
    var deferred = Q.defer();
    http.get(url, function(response) {
        response.setEncoding('binary');
        var image = '';

        response.on('data', function(chunk) {
            image += chunk;
        });

        response.on('error', function(err) {
            deferred.reject(err);
        });

        response.on('end', function() {
            var image2 = new Buffer(image, 'binary');
            deferred.resolve(image2);
        })
    });

    return deferred.promise;
};

exports.store = function(url, cb) {
    var acc = {};
    var promise = write_connect
        .then(function(db) {
            var gridStore = new GridStore(db, url, 'w');
            acc.db = db;
            return Q.ninvoke(gridStore, 'open');
        })
        .then(function(gridStore) {
            acc.gridStore = gridStore;
            return httpGet(url)
                .then(function(image) {
                    return Q.ninvoke(gridStore, 'write', image);
                })
                .then(function(gridStore) {
                    return Q.ninvoke(gridStore, 'close');
                })
        });
    return cb(promise)
        .finally(function() {
            acc.db.close();
        });
};


exports.fetch = function(url, cb) {
    var acc = {};
    var promise = read_connect
        .then(function(db) {
            var gridStore = new GridStore(db, url, 'r');
            acc.db = db;
            return Q.ninvoke(gridStore, 'open');
        })
        .then(function(gridStore) {
            return Q.ninvoke(GridStore, 'read', acc.db, url);
        });
    return cb(promise)
        .finally(function() {
            acc.db.close();
        });
};