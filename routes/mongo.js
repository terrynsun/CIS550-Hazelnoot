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


exports.cache = function(req, res){
	MongoClient.connect('mongodb://pennterest:tMUHaBz8G4vdfZ@ds053828.mongolab.com:53828/hazelnoot_cache', function(err, db) {
		if(!err) {
			console.log("We are connected");
		}
		// http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F8%2F88%2FGolden_jackal_small.jpg%2F50px-Golden_jackal_small.jpg
		var fileId = decodeURIComponent(req.query.url);
		// Create a new instance of the gridstore
		var gridStore = new GridStore(db, fileId, 'w');
		// Open the file
		gridStore.open(function(err, gridStore) {

			http.get(fileId, function (response) {

				response.setEncoding('binary');

				var image2 = '';

				console.log('reading data in chunks first');
				response.on('data', function(chunk){
					image2 += chunk;
					console.log('reading data');
				});

				response.on('end', function() {
					console.log('done reading data');

					var image = new Buffer(image2,"binary");

	                    // Write some data to the file
	                    gridStore.write(image, function(err, gridStore) {
	                    	assert.equal(null, err);

	                      // Close (Flushes the data to MongoDB)
	                      gridStore.close(function(err, result) {
	                      	assert.equal(null, err);

	                      	// GridStore.read(db, fileId, function(err, fileData) {
	                      	// 	assert.equal(image.toString('base64'), fileData.toString('base64'));

	                      	// 	console.log('Done, writing local images for testing purposes');

	                            // var fd =  fs.openSync('image.jpg', 'w');

	                            // fs.write(fd, image, 0, image.length, 0, function(err,written){

	                            // });

	                            // var fd2 =  fs.openSync('image_copy.jpg', 'w');
	                            // fs.write(fd2, fileData, 0, fileData.length, 0, function(err,written){

	                            // });

	                      	res.writeHead(200, {
	                      		'Content-Type': 'text/plain',
	                      		'Content-Length':'File cached'.length});

	                      	// console.log("File length is " +fileData.length);
	                      	res.write('File cached');
	                      	res.end('File cached');
	                      	console.log('Really done');

	                      });
});
});
});

});
});



}