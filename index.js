require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(cors());
app.use(express.static('public'));

app.get("/", function(req, res) {
    res.json({greeting: "Welcome to main the API of companion"});
});

var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + port);
});
