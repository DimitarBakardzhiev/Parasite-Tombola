/**
 * Created by Dimitar on 8.1.2015 г..
 */
var encryption = require('./../encryption');
module.exports = function (mongoose) {
    var userSchema = mongoose.Schema({
        username: { type: String, required: true },
        passwordHash: { type: String, required: true },
        salt: { type: String, required: true }
    });

    var User = mongoose.model('User', userSchema);
    User.find({}, function (err, users) {
       if (users.length === 0) {
            var salt = encryption.generateSalt();
            var passwordHash = encryption.generateHashedPassword(salt, 'Cor752zz');
           User.create({
               username: 'ParasiteAdmin',
               salt: salt,
               passwordHash: passwordHash
           }, function (err, user) {
              if (err) {
                  console.log(err.message);
              }

               console.log(user);
           });
       }
    });
}