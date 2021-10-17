require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
const axios = require('axios');

const port = process.env.PORT || 3000;

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const schema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => { console.dir(req); next(); });

app.get("/", function(req, res) {
    res.json({greeting: "Welcome to main the API of companion"});
});

// check if user exists
// search for a particular user from db
app.get("/api/v1/users/:_id", function(req, res) {
    Person.findOne({_id: req.params._id}, function(err, user){
        if(err){
            console.log(err);
            res.status(500).send({error: "User not able to be retrieved"});
        }else{
            res.status(200).json(user);
        }
    });
});

// get id of user
app.post("/api/v1/user", function(req, res) {
    var email = req.body.email;
    Person.findOne({email: email}, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            res.json({"_id": user._id});
        }
    });
});

// create new user (signup)
app.post("/api/v1/users", function(req, res) {
    // add conditional to check if user already exists)
    var user = req.body;

    Person.find({email: user.email}, function(err, data) {
        if (err) {
            res.status(500).json({error: err});
        } else if (data.length > 0) {
            res.status(400).json({error: "User already exists"});
        } else {
            var newUser = new Person({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                age: user.age,
                logs: []
            });
            newUser.save(function(err, data) {
                if (err) {
                    res.status(500).json({error: err});
                } else {
                    res.status(201).json({message: "User created"});
                }
            });
        }
    });
});

// get user's logs
app.get("/api/v1/:_id/logs", function(req, res) {
    const id = req.params._id;
    Person.find({_id: id}, function(err, data) {
        if (err) {
            res.status(500).json({error: err});
        } else if (data.length === 0) {
            res.status(404).json({error: "User not found"});
        } else {
            res.status(200).json({logs: data[0].logs});
        }
    });
});

// add new log to a user
app.patch("/api/v1/:_id/logs", async function(req, res) {
    const id = req.params._id;
    const log = req.body;
    const date = new Date();
    const newLog = {
        date: date,
        message: log.message,
        mood: log.mood
    };
    try {
        const user = await Person.findOne({_id: id});
        if (user) {
            user.logs.push(newLog);
            await user.save();
            res.status(201).json({message: "Log added"});
        } else {
            res.status(404).json({error: "User not found"});
        }
    } catch (err) {
        res.status(500).json({error: err});
    }
});

// get all users from db
app.get("/api/v1/users", function(req, res) {
    console.log("here");
    Person.find({}, function(err, users) {
        if (err) {
            res.status(500).send({error: "Users not able to be retrieved"});
        } else {
            res.status(200).json(users);
        }
    });
});

// validate user login credentials
app.post("/api/v1/validate/", function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    Person.findOne({email: email, password: password}, function(err, user) {
        if (err) {
            console.log(err);
            res.status(500).send({error: "User not found"});
        } else {
            res.status(201).json({data: user});
        }
    });
});

app.get('/api/v1/assemblyai', async (req, res) => {
    try {
      const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
        { expires_in: 3600 }, // can set a TTL timer in seconds.
        { headers: { authorization: process.env.ASSEMBLYAI_KEY } }); // AssemblyAI API Key goes here
      const { data } = response;
      res.json(data);
    } catch (error) {
      const {response: {status, data}} = error;
      res.status(status).json(data);
    }
});

// chatbot
// app.post("/api/v1/chatbot" async (req, res) => {
//     const message = req.body.message;
//     const url = "https://companion-api-htv5.herokuapp.com/api/v1" + process.env.TOKEN;
//     const { data } = await axios.post(url, {message: message});
//     res.json(data);
// });

var listener = app.listen(port, function () {
    console.log('Your app is listening on port ' + port);
});
