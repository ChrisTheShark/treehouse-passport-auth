var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        trim: true,
    },
    favoriteBook: {
        type: String,
        trim: true
    },
    photo: {
        type: String,
        trim: true
    }
});

module.exports = mongoose.model('User', UserSchema);
