var cache = require('../cache');

exports.cache = function(req, res) {
    cache.store(req.query.url)
        .then(function(result) {
            res.send(200, result);
        })
        .fail(function(err) {
            res.send(500, err);
        })
        .done();
};

exports.get = function(req, res) {
    cache.fetch(req.query.url)
        .then(function(fileData) {
            res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Content-Length':fileData.length
            });

            console.log("File length is " +fileData.length);
            res.end(fileData,"binary");
            console.log('Really done');
        })
        .fail(function(err) {
            console.error(err);
            res.send(500, err);
        })
        .done();
};
