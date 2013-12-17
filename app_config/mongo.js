var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;
var Q = require('q');
require('js-yaml');
var config = require('../config/db.yaml').mongo;

var serverConfig = {
    native_parser: true,
    auto_reconnect: true,
    socketOptions: {
        keepAlive: 300,
        connectTimeoutMS: 20,
        socketTimeoutMS: 10
    }
};

exports.read_connect = Q.nfcall(MongoClient.connect, config.readonly, serverConfig);
exports.write_connect = Q.nfcall(MongoClient.connect, config.pennterest, serverConfig);
