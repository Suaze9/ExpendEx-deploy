const mongoose = require('mongoose');

const Category = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 1,
        max: 50,
    },
    user: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model('Category', Category);
