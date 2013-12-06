
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var passport = require('passport');

var app = express();
require('./app_config/express')(app);
require('./app_config/passport')();
require('./router')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
