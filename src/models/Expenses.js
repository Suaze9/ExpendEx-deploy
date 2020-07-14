const mongoose = require('mongoose');

const Expense = mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Expense', Expense);
