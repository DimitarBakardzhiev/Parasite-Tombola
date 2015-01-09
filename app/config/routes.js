/**
 * Created by Dimitar on 8.1.2015 г..
 */
var Player = require('mongoose').model('Player');
var passport = require('passport');
var encryption = require('../encryption');
var User = require('mongoose').model('User');
var Greeting = require('mongoose').model('Greeting');
var playerController = require('../controllers/playerController');

module.exports = function (app) {
    app.get('/', function (req, res) {
        Greeting.find({}, function (err, greetings) {
            var greeting = greetings[0].content;
            res.render('index', {
                title: 'Начало',
                year: new Date().getFullYear(),
                user: req.user,
                greeting: greeting
            });
        });

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
        Player.find({ email: req.body.email }, function (err, players) {
            if (players.length > 0) {
                res.render('register', {
                    title: 'Записване',
                    year: new Date().getFullYear(),
                    user: req.user,
                    warning: 'Е-мейлът вече е зает!'
                });
            } else {
                var player = new Player({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber
                }).save(function (err, newPlayer) {
                        if (err) {
                            console.log(err.message);
                        }
                    });

                Greeting.find({}, function (err, greetings) {
                    var greeting = greetings[0].content
                    res.render('index', {
                        title: 'Начало',
                        year: new Date().getFullYear(),
                        user: req.user,
                        greeting: greeting,
                        success: 'Успешно се записахте за томболата!'
                    });
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
                        user: req.user
                    });
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
    app.get('/edit/:id', function (req, res) {
        playerController.find(req.params.id).then(function (player) {
            res.render('editPlayer', {
                title: 'Смяна на парола',
                year: new Date().getFullYear(),
                user: req.user,
                player: player
            })
        });
    });
    app.post('/edit/:id', function (req, res) {
        playerController.update(req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        }).then(function (updated) {
            return res.redirect('/all');
        });
    });
    app.get('/delete/:id', function (req, res) {
        playerController.remove(req.params.id).then(function (player) {
            Greeting.find({}, function (err, greetings) {
                var greeting = greetings[0].content;
                res.render('index', {
                    title: 'Начало',
                    year: new Date().getFullYear(),
                    user: req.user,
                    greeting: greeting,
                    warning: 'Участникът ' + player.email + ' е изтрит!'
                });
            })
        });
    });
    app.get('/greeting', function (req, res) {
        if (req.user) {
            Greeting.find({}, function (err, greetings) {
                var greeting = greetings[0].content;
                res.render('greeting', {
                    title: 'Редактиране на началния поздрав',
                    year: new Date().getFullYear(),
                    user: req.user,
                    greeting: greeting
                });
            });
        } else {
            res.redirect('/login');
        }
    });
    app.post('/greeting', function (req, res) {
        if (req.user) {
            Greeting.find({}, function (err, greetings) {
                Greeting.update(greetings[0], { content: req.body.greeting }, function (err, newGreeting) {
                    res.redirect('/');
                });
            });
        } else {
            res.redirect('/login');
        }
    });
}