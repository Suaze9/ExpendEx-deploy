require('dotenv/config');
const PORT = process.env.PORT;

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const auth = require('./routes/auth');
const users = require('./routes/users');
const expenses = require('./routes/expenses');
const categories = require('./routes/categories');
const expenseTypes = require('./routes/expenseTypes');
const stats = require('./routes/stats');
const path = require("path");


app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/expenses', expenses);
app.use('/api/categories', categories);
app.use('/api/expenseTypes', expenseTypes);
app.use('/api/stats', stats);
app.use(express.static(path.join(__dirname, "../client/build")))


mongoose.connect(process.env.MNG_CREDENTIALS, { useUnifiedTopology: true, useNewUrlParser: true }, ()=>{
    console.log('Databse connected :D');
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, ()=>{
    console.log(`listening to port ${PORT}`)
})