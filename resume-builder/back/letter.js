const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const letterSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

    yourName: {
        type: String
    },
    paragraphs: {
        type: Array
    }
});

module.exports = mongoose.model('Letter', letterSchema);
