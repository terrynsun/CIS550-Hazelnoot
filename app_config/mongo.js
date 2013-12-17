var MongoClient = require('mongodb').MongoClient;
var Q = require('q');
require('js-yaml');
var config = require('../config/db.yaml').mongo;

exports.read_connect = Q.nfcall(MongoClient.connect, config.readonly);
exports.write_connect = Q.nfcall(MongoClient.connect, config.pennterest);
