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
    password: String,
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

const restricted = express.Router();
restricted.use(bearerToken());
restricted.use(async (req, res, next) => {
  if (!req.token) res.status(403).send({ success: false, message: `Unauthorized (${message})` });
  try {
    const token = await jwt.verify(req.token, process.env.TOKEN_SECRET);
    req.userId = token.id;
    next();
  } catch (err) {
    failUnauthorized(res, 'invalid token');
  }
});

app.get("/", function(req, res) {
    res.json({greeting: "Welcome to main the API of companion"});
});

app.post("/api/v1/users", function(req, res) {
    var user = req.body;
    console.log(user);
    var newUser = new Person({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        age: user.age,
        logs: []
    });
    newUser.save(function(err, user) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.status(201).send(user);
        }
    });
});

// app.get("/api/v1/users", function(req, res) {
//     // get all the users from the mongodb
//     // return the users in json format
// });

var listener = app.listen(port, function () {
    console.log('Your app is listening on port ' + port);
});
