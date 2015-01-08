/**
 * Created by Dimitar on 8.1.2015 г..
 */
var Player = require('mongoose').model('Player');
var passport = require('passport');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'Express', year: new Date().getFullYear(), user: req.user });
    });
    app.get('/register', function (req, res) {
        res.render('register', { title: 'Записване', year: new Date().getFullYear(), user: req.user })
    });
    app.post('/register', function (req, res) {
        Player.find({ phoneNumber: req.body.phoneNumber }, function (err, players) {
            if (players.length > 0) {
                res.redirect('/register');
            } else {
                var player = new Player({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    phoneNumber: req.body.phoneNumber
                }).save(function (err, newPlayer) {
                        if (err) {
                            console.log(err.message);
                        }

                        console.log(newPlayer);
                    });

                res.redirect('/');
            }
        });
    });
    app.get('/all',
        function (req, res) {
            if (req.user) {
                Player.find({}, function (err, all) {
                    res.render('allPlayers', {
                        title: 'Всички участници',
                        year: new Date().getFullYear(),
                        players: all,
                        user: req.user});
                });
            } else {
                res.redirect('/login');
            }
        });
    app.get('/conditions', function (req, res) {
        res.render('conditions', { title: 'Условия за участие', year: new Date().getFullYear(), user: req.user });
    });
    app.get('/login', function (req, res) {
        res.render('login', { title: 'Влизане като администратор', year: new Date().getFullYear(), user: req.user })
    });
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function(req, res) {
            console.log(req.body.username + ' ' + req.body.password);
            res.redirect('/');
        });
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
}