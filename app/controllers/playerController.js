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
    var deffered = q.defer();
    Player.create(player, function (err, newPlayer) {
        deffered.resolve(newPlayer);
    });

    return deffered.promise;
}

function update(id, updatedData) {
    var deffered = q.defer();
    Player.findByIdAndUpdate(id, updatedData, function (player) {
        deffered.resolve(player);
        console.log(player);
    });

    return deffered.promise;
}

function remove(id) {
    var deffered = q.defer();
    Player.findByIdAndRemove(id, function (err, player) {
        deffered.resolve(player);
    });

    return deffered.promise;
}

module.exports = {
    all: all,
    find: find,
    create: create,
    update: update,
    remove: remove
}