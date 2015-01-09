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
        db: 'mongodb://Inzaghi:123456@ds029911.mongolab.com:29911/parasitetombola',
        port: process.env.PORT || 3030
    }
}