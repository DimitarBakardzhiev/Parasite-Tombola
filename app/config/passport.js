/**
 * Created by Dimitar on 8.1.2015 г..
 */
var passport = require('passport');
var User = require('mongoose').model('User');
var LocalStrategy = require('passport-local').Strategy;
var encryption = require('../encryption');

module.exports = function () {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            process.nextTick(function () {
                User.findOne({ username: username }, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    var passwordHash = encryption.generateHashedPassword(user.salt, password);
                    if (user.passwordHash != passwordHash) { return done(null, false); }
                    return done(null, user);
                })
            });
        }
    ));
}