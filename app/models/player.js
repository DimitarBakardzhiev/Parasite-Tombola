/**
 * Created by Dimitar on 8.1.2015 г..
 */
module.exports = function (mongoose) {
    var playerSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        phoneNumber: { type: String, required: true, unique: true }
    });

    var Player = mongoose.model('Player', playerSchema);
}