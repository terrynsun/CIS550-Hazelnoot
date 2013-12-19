var path = require('path');
var cache = require('../cache');
var utils = require('../utils');

exports.get = function(req, res) {
    cache.fetch(decodeURIComponent(req.query.url))
        .then(function(fileData) {
            var ext = path.extname(req.query.url).split('.');
            ext = ext[ext.length - 1];

            res.writeHead(200, {
                'Content-Type': utils.extToMimeType(ext),
                'Content-Length': fileData.length
            });

            res.end(fileData,"binary");
        })
        .fail(function(err) {
            console.error(err);
            res.send(500, err);
        })
        .done();
};
