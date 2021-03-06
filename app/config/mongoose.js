/**
 * Created by Dimitar on 8.1.2015 г..
 */

module.exports = function (config) {
    var mongoose = require('mongoose');
    mongoose.connect(config.db);

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        console.log('Database up and running.');
    });

    require('./../models/player')(mongoose);
    require('./../models/user')(mongoose);
    require('./../models/greeting')(mongoose);
}