/**
 * Simple Node.js caching application for CIS 550
 * 
 * zives
 */

/**
 * Module dependencies.
 */
var Db = require('mongodb').Db,
 MongoClient = require('mongodb').MongoClient,
 Server = require('mongodb').Server,
 ReplSetServers = require('mongodb').ReplSetServers,
 ObjectID = require('mongodb').ObjectID,
 Binary = require('mongodb').Binary,
 GridStore = require('mongodb').GridStore,
 Grid = require('mongodb').Grid,
 Code = require('mongodb').Code,
 BSON = require('mongodb').pure().BSON,
 assert = require('assert');

var request = require('request');

exports.do_work = function(req, res){
MongoClient.connect('mongodb://pennterest:555555@ds053828.mongolab.com:53828/hazelnoot_cache', function(err, db) {
    var fileId = 'ourexamplefiletowrite.txt';
  // Create a new instance of the gridstore
  var gridStore = new GridStore(db, 'ourexamplefiletowrite.txt', 'w');

  // Open the file
  gridStore.open(function(err, gridStore) {

      request('http://i.imgur.com/cxWPvr8.png', function (error, response, body) {

            image = new Buffer(body, 'binary');

            // Write some data to the file
            gridStore.write(image, function(err, gridStore) {
              assert.equal(null, err);

              // Close (Flushes the data to MongoDB)
              gridStore.close(function(err, result) {
                assert.equal(null, err);

                // Verify that the file exists
                GridStore.exist(db, 'ourexamplefiletowrite.txt', function(err, result) {
                  assert.equal(null, err);
                  assert.equal(true, result);
                  
                  // Read back all the written content and verify the correctness
                  GridStore.read(db, fileId, function(err, fileData) {
                    assert.equal(image.toString('base64'), fileData.toString('base64'));

                  console.log('Done');

                    db.close();
                  });                 
                });
              });
            });

        });
  });
});
}
//