/**
 * Created by Dimitar on 8.1.2015 г..
 */
module.exports = function (mongoose) {
    var playerSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, unique: false },
        email: { type: String, required: true }
    });

    var Player = mongoose.model('Player', playerSchema);
}