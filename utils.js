var path = require('path');
var _ = require('underscore');

exports.isImage = function(filepath) {
    var ext = path.extname(filepath).split('.');
    ext = ext[ext.length - 1];
    return _.contains(['jpg', 'png', 'gif'], ext);
};