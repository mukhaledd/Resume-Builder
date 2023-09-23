const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resumeSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    phone: {
        type: String,
        required: true
    },

    email: {
        type: String
    },
    skills: {
        type: Array
    },

    languages: {
        type: Array,
    },

    experiences: {
        type: Array
    },

    educations: {
        type: Array
    },
});

module.exports = mongoose.model('Resume', resumeSchema);
