/**
 * Created by Dimitar on 8.1.2015 г..
 */
var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost/tombola',
        port: process.env.PORT || 3030
    },
    production: {
        rootPath: rootPath,
        db: 'todo',
        port: process.env.PORT || 3030
    }
}