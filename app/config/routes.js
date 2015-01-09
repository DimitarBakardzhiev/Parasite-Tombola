/**
 * Created by Dimitar on 8.1.2015 г..
 */
var Player = require('mongoose').model('Player');
var passport = require('passport');
var encryption = require('../encryption');
var User = require('mongoose').model('User');
var playerController = require('../controllers/playerController');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: 'Начало', year: new Date().getFullYear(), user: req.user });
    });
    app.get('/register', function (req, res) {
        res.render('register', { title: 'Записване', year: new Date().getFullYear(), user: req.user })
    });
    app.post('/register', function (req, res) {
        if (req.body.firstName.length < 3 || req.body.firstName.length > 30
            || req.body.lastName.length < 3 || req.body.lastName.length > 30) {
            return res.render('register', {
                title: 'Записване',
                year: new Date().getFullYear(),
                user: req.user,
                warning: 'Името и фамилията трябва да са между 3 и 30 символа!'
            });
        }
        Player.find({ phoneNumber: req.body.phoneNumber }, function (err, players) {
            if (players.length > 0) {
                res.render('register', {
                    title: 'Записване',
                    year: new Date().getFullYear(),
                    user: req.user,
                    warning: 'Телефонният номер вече е зает!'
                });
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

                res.render('index', {
                    title: 'Начало',
                    year: new Date().getFullYear(),
                    user: req.user,
                    success: 'Успешно се записахте за томболата!'
                });
            }
        });
    });
    app.get('/all',
        function (req, res) {
            if (req.user) {
                playerController.all().then(function (all) {
                    res.render('allPlayers', {
                        title: 'Всички участници',
                        year: new Date().getFullYear(),
                        players: all,
                        user: req.user});
                });
                //Player.find({}, function (err, all) {
                //    res.render('allPlayers', {
                //        title: 'Всички участници',
                //        year: new Date().getFullYear(),
                //        players: all,
                //        user: req.user});
                //});
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
    app.get('/changePassword', function (req, res) {
        if (req.user) {
            res.render('changePassword', { title: 'Смяна на парола', year: new Date().getFullYear(), user: req.user })
        } else {
            res.redirect('/login');
        }
    });
    app.post('/changePassword', function (req, res) {
        if (req.user.passwordHash != encryption.generateHashedPassword(req.user.salt, req.body.oldPassword)) {
            res.render('changePassword', {
                title: 'Смяна на парола',
                year: new Date().getFullYear(),
                user: req.user,
                warning: 'Въведената стара парола е грешна!'
            });
        } else if (req.body.newPassword != req.body.confirmPassword) {
            res.render('changePassword', {
                title: 'Смяна на парола',
                year: new Date().getFullYear(),
                user: req.user,
                warning: 'Новата парола и потвърдената парола се различават!'
            });
        } else if (req.body.newPassword.length <= 3) {
            res.render('changePassword', {
                title: 'Смяна на парола',
                year: new Date().getFullYear(),
                user: req.user,
                warning: 'Паролата трябва да бъде по-дълга от 3 символа!'
            });
        } else {
            User.findById(req.user._id, function (err, user) {
                user.passwordHash = encryption.generateHashedPassword(user.salt, req.body.newPassword);
                user.save(function (err, savedUser) {
                    res.redirect('/');
                });
            });
        }
    });
    app.get('/getPlayers', function (req, res) {
        var controller = require('../controllers/playerController');
        controller.find('54af05c5eec2fa94139c63d8').then(function (players) {
            console.log(players);
        });
        return res.end;
    });
}