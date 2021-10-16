require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    logs: [
        {
            date: Date,
            message: String,
            mood: String
        }
    ]
});

const Person = mongoose.model('Person', schema);

app.use(cors());
app.use(express.static('public'));

app.get("/", function(req, res) {
    res.json({greeting: "Welcome to main the API of companion"});
});

app.post("/api/v1/users", function(req, res) {
    var user = req.body;
    console.log(user);
});

// get all the users from the mongodb
// return the users in json format
app.get("/api/v1/users", function(req, res) {
    Person.find({}, function(err, pers){
        if(err){
            return next(err);
        }
        res.json(pers);
    });
    return res;
});

var listener = app.listen(port, function () {
    console.log('Your app is listening on port ' + port);
});
