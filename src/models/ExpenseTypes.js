const mongoose = require('mongoose');

const ExpenseType = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 0,
        max: 50,
    },
    category: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('ExpenseType', ExpenseType);
