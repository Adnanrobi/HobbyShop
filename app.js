require('dotenv').config();
const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.routes')
const bodyParser = require('body-parser')


const mongoose = require('mongoose');
require('dotenv').config();

//Connect to DB:
mongoose.connect(process.env.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to Database!")
}).catch((error) => {
    console.log("Error");
});

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.use(authRoutes);

module.exports = app;