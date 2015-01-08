/**
 * Created by Dimitar on 8.1.2015 г..
 */
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var passport = require('passport');

module.exports = function (app, express, config) {
    app.set('port', config.port);
    app.set('views', path.join(config.rootPath, 'views'));
    app.set('view engine', 'jade');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(require('stylus').middleware(path.join(config.rootPath, 'public')));
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(config.rootPath, 'public')));

// development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }
}