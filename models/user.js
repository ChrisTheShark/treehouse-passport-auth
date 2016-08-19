var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    favoriteBook: {
        type: String,
        required: false,
        trim: true
    },
    photo: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('User', UserSchema);
