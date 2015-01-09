/**
 * Created by Dimitar on 9.1.2015 г..
 */
var Player = require('mongoose').model('Player');
var q = require('q');

function all() {
    var deffered = q.defer();
    Player.find({}, function (err, players) {
        deffered.resolve(players);
    });

    return deffered.promise;
}

function find(id) {
    var deffered = q.defer();
    Player.findById(id, function (err, player) {
        deffered.resolve(player);
    });

    return deffered.promise;
}

function create(player) {

}

function update(player) {

}

function remove(id) {

}

module.exports = {
    all: all,
    find: find,
    create: create,
    update: update,
    remove: remove
}