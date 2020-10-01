const express = require('express');
const mongoose = require("mongoose");

// Require all models
const db = require("./models");
console.log(db);

// Require body parser and logger
const bodyParser = require("body-parser");
const logger = require("morgan");

// Connect to MongoDB
mongoose.connect("mongodb+srv://mohsin:Mohsin1!@cluster0.wthlg.mongodb.net/fd-dev?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }).then(
    (_) => {
        console.log(`Server correctly connected`);
    },
    (err) => {
        console.log("Error occured while connecting", err);
    }
);

const port = 4000;

// Initialize Express
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public static folder
app.use(express.static("public"));

// const Volunteer = require("./models/Volunteer")

mongoose.set("useFindAndModify", false);

// use body parser and logger
app.use(logger("dev"));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('hello')
})

app.get('/volunteers', (req, res) => {
    db.Volunteer.find()
        .then(
            (volunteers) => {
                res.send({
                    success: true,
                    message: 'volunteer list',
                    data: volunteers
                })
            },
            (err) => res.send(err)
        );

})

app.get('/address', (req, res) => {
    db.Address.find()
        .then(
            (address) => {
                res.send({
                    success: true,
                    message: 'addressF list',
                    data: address
                })
            },
            (err) => res.send(err)
        );

})


// Route for creating a new Volunteer
app.post("/volunteer", function (req, res) {
    console.log("req.body", req.body)
    db.Volunteer.create(req.body)
        .then(function (volunteer) {
            // If we were able to successfully create a Volunteer, send it back to the client
            return res.send({
                success: true,
                message: 'volunteer has been created!',
                data: volunteer
            });
        })
        .catch(function (error) {
            // If an error occurred, send it to the client
            return res.send({
                success: false,
                message: error,
            });
        });
});

// Route for creating a new Address and updating Volunteer "address" field with it
app.post("/address/:vid", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Address.create(req.body)
        .then(function (dbAddress) {
            // If a Address was created successfully, find one Volunteer with an `_id` equal to `req.params.vid`. Update the Volunteer to be associated with the new Address
            // { new: true } tells the query that we want it to return the updated Volunteer -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Volunteer.findOneAndUpdate({ _id: req.params.vid }, { address: dbAddress._id }, { new: true });
        })
        .then(function (dbVolunteer) {
            // If we were able to successfully update a Volunteer, send it back to the client
            return res.send({
                success: true,
                message: 'Address has been created and associated with the Volunteer',
                data: dbVolunteer
            });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.send({
                success: false,
                message: error,
            });
        });
});

// Route for retrieving a Volunteer by id and populating it's Addresses.
app.get("/volunteer/:vid", function (req, res) {
    // Using the vid passed in the vid parameter, prepare a query that finds the matching one in our db...
    db.Volunteer.findOne({ _id: req.params.vid })
        // ..and populate all of the address associated with it
        .populate("address")
        .then(function (dbVolunteer) {
            // If we were able to successfully find an Volunteer with the given id, send it back to the client
            return res.send({
                success: true,
                message: 'volunteer',
                data: dbVolunteer
            });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for retrieving a Address by id
app.get("/address/:aid", function (req, res) {
    // Using the aid passed in the aid parameter, prepare a query that finds the matching one in our db...
    db.Address.findOne({ _id: req.params.aid })
        .then(function (dbAddress) {
            // If we were able to successfully find an Address with the given id, send it back to the client
            return res.send({
                success: true,
                message: 'volunteer',
                data: dbAddress
            });
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// app.post('/update-volunteer', (req, res) => {
//     const { body } = req;
//     let { name, _id } = body;
//     console.log("name", name)
//     var myquery = { _id };
//     var newvalues = { $set: { name } };
//     Volunteer.updateOne(myquery, newvalues, (error, volunteer) => {
//         if (error) {
//             return res.send({
//                 success: false,
//                 message: error,
//             });
//         }
//         return res.send({
//             success: true,
//             message: 'volunteer has been updated!',
//             data: volunteer
//         });
//     });
// })

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})