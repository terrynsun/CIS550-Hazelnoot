var path = require('path');
var _ = require('underscore');

exports.isImage = function(filepath) {
    var ext = path.extname(filepath).split('.');
    ext = ext[ext.length - 1];
    return _.contains(['jpg', 'png', 'gif'], ext);
};

exports.urlOrCache = function(url, isCached) {
    if (isCached) {
        return '/cached/retrieve?url=' + url;
    } else{
        return url;
    }
};

exports.extToMimeType = function(ext) {
    switch (ext) {
        case "jpg": // Intentional fall-through
        case "jpeg": return "image/jpeg";
        case "gif": return "image/gif";
        case "png": return "image/png";
        case "pdf": return "application/pdf";
        default: return null;
    }
}