/**
 * Created by Dimitar on 9.1.2015 г..
 */
module.exports = function (mongoose) {
    var greetingSchema = mongoose.Schema({
        content: String
    });

    var Greeting = mongoose.model('Greeting', greetingSchema);

    Greeting.find({}, function (err, greetings) {
        if (greetings.length === 0) {
            Greeting.create({
                content: 'Добре дошли!'
            }, function (err, greeting) {
                console.log(greeting);
            });
        }
    });
}