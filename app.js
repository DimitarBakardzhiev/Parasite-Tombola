
/**
 * Module dependencies.
 */

var express = require('express');

var app = express();
var env = process.env.NODE_ENV || 'development';
var config = require('./app/config/config')[env];

require('./app/config/express')(app, express, config);
require('./app/config/mongoose')(config);
require('./app/config/passport')();
require('./app/config/routes')(app);

app.listen(config.port, function () {
    console.log('Express server listening on port ' + config.port);
});
