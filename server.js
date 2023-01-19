// Import Dependencies

const express = require("express"); // import the express framework
const mongoose = require("mongoose"); // import the mongoose library
const morgan = require("morgan"); // import the morgan request logger
require("dotenv").config(); // Load my ENV file's variables
const path = require("path"); // import path module

// Import Our Models

const Car = require("./models/car");

// Database Connection

// this is where we will set up our inputs for our database connect function
const DATABASE_URL = process.env.DATABASE_URL;
// here is our DB config object
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// establish our database connection
mongoose.connect(DATABASE_URL, CONFIG);

// Tell mongoose what to do with certain events
// what happens when we open, diconnect, or get an error
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (err) => console.log("An error occurred: \n", err));

// Create our Express App Object //

const app = express();

// Middleware

// middleware runs before all the routes.
// every request is processed through our middleware before mongoose can do anything with it
app.use(morgan("tiny")); // this is for request loggging, the 'tiny' argument declares what size of morgan log to use
app.use(express.urlencoded({ extended: true })); //this parses urlEncoded request bodies(useful for POST and PUT requests)
app.use(express.static("public")); // this serves static files from the 'public' folder
app.use(express.json()); // parses incoming request payloads with JSON

//// Routes

app.get("/", (req, res) => {
  res.send("Server is live, ready for requests");
});

// we're going to build a seed route
// this will seed the database for us with a few starter resources
// There are two ways we will talk about seeding the database
// First -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices
app.get("/cars/seed", (req, res) => {
  // array of starter resources(fruits)
  const cars = [
    { name: "Ferari", color: "red", readyToRide: true },
    { name: "Volvo", color: "black", readyToRide: true },
    { name: "BMW", color: "blue", readyToRide: false },
  ];
  // then we delete every fruit in the database(all instances of this resource)
  Car.deleteMany({}).then(() => {
    // then we'll seed(create) our starter cars
    Car.create(cars)
      // tell our db what to do with success and failures
      .then((data) => {
        res.json(data);
      })
      .catch((err) => console.log("The following error occurred: \n", err));
  });
});

// INDEX route
// Read -> finds and displays all fruits
app.get("/cars", (req, res) => {
  // find all the fruits
  Car.find({})
    // send json if successful
    .then((cars) => {
      res.json({ cars: cars });
    })
    // catch errors if they occur
    .catch((err) => console.log("The following error occurred: \n", err));
});

// CREATE route
// Create -> receives a request body, and creates a new document in the database
app.post("/cars", (req, res) => {
  // here, we'll have something called a request body
  // inside this function, that will be called req.body
  // we want to pass our req.body to the create method
  const newCar = req.body;

  Car.create(newCar)
    // send a 201 status, along with the json response of the new fruit
    .then((car) => {
      res.status(201).json({ car: car.toObject() });
    })
    // send an error if one occurs
    .catch((err) => console.log(err));
});

// SHOW route
// Read -> finds and displays a single resource
app.get("/cars/:id", (req, res) => {
  // get the id -> save to a variable
  const id = req.params.id;
  // use a mongoose method to find using that id
  Car.findById(id)
    // send the fruit as json upon success
    .then((car) => {
      res.json({ car: car });
    })
    // catch any errors
    .catch((err) => console.log(err));
});

// Server Listener
const PORT = process.env.PORT;
app.listen(PORT, () =>
  console.log(`Now listening to the sweet sounds of port: ${PORT}`)
);

// END
