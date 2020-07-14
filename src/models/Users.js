const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 4,
        max: 50,
    },
    email: {
        type: String,
        required: true, 
        min: 3,
        max: 254,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    budget: {
        type: Number,
        default: 0
    },
});

module.exports = mongoose.model('User', User);

//WajPSWaNiGFAPlcn
//rootpassword190