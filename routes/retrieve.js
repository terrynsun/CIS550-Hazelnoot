var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code,
BSON = require('mongodb').pure().BSON,
assert = require('assert');
var MongoDB = require('mongodb');
var fs = require('fs');

var request = require('request');
var http = require('http');


exports.do_work = function(req, res){
	MongoClient.connect('mongodb://readonly:y#HWU-Jnh45ts6lJ@ds053828.mongolab.com:53828/hazelnoot_cache', function(err, db) {
		if(!err) {
			console.log("We are connected");
		}

		
		var fileId = 'http://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Golden_jackal_small.jpg/50px-Golden_jackal_small.jpg';
		// Create a new instance of the gridstore
		var gridStore = new GridStore(db, fileId, 'r');
		gridStore.open(function(err, gridStore) {
			GridStore.read(db, fileId, function(err, fileData) {
				// assert.equal(image.toString('base64'), fileData.toString('base64'));	                  

				res.writeHead(200, {
					'Content-Type': 'image/jpeg',
					'Content-Length':fileData.length});

				console.log("File length is " +fileData.length);
				res.write(fileData, "binary");
				res.end(fileData,"binary");
				console.log('Really done');

			});
		});
	});
}