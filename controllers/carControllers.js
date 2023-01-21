// Import Dependencies

const express = require("express");
const Car = require("../models/car");

// Create Router

const router = express.Router();

// Routes

// we're going to build a seed route
// this will seed the database for us with a few starter resources
// There are two ways we will talk about seeding the database
// First -> seed route, they work but they are not best practices
// Second -> seed script, they work and they ARE best practices
router.get("/seed", (req, res) => {
  // array of starter resources(cars)
  const cars = [
    { name: "Ferari", color: "red", readyToRide: true },
    { name: "Volvo", color: "black", readyToRide: true },
    { name: "BMW", color: "blue", readyToRide: false },
  ];
  // then we delete every car in the database(all instances of this resource)
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
// Read -> finds and displays all cars
router.get("/", (req, res) => {
  // find all the cars
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
router.post("/", (req, res) => {
  // here, we'll have something called a request body
  // inside this function, that will be called req.body
  // we want to pass our req.body to the create method
  const newCar = req.body;

  Car.create(newCar)
    // send a 201 status, along with the json response of the new car
    .then((car) => {
      res.status(201).json({ car: car.toObject() });
    })
    // send an error if one occurs
    .catch((err) => console.log(err));
});

// PUT route
// Update -> updates a specific car
// PUT replaces the entire document with a new document from the req.body
// PATCH is able to update specific fields at specific times, but it requires a little more code to
// ensure that it works properly, so we'll use that later
router.put("/:id", (req, res) => {
  // save the id to a variable for easy use later
  const id = req.params.id;
  // save the request body to a variable for easy reference later
  const updatedCar = req.body;
  // we're going to use the mongoose method:
  // findByIdAndUpdate
  // eventually we'll change how this route works, but for now, we'll do everything in one shot, with findByIdAndUpdate
  Car.findByIdAndUpdate(id, updatedCar, { new: true })
    .then((car) => {
      console.log("the newly updated car", car);
      // update success message will just be a 204 - no content
      res.sendStatus(204);
    })
    .catch((err) => console.log(err));
});

// DELETE route
// Delete -> delete a specific car
router.delete("/:id", (req, res) => {
  // get the id from the req
  const id = req.params.id;
  // find and delete the car
  Car.findByIdAndRemove(id)
    // send a 204 if successful
    .then(() => {
      res.sendStatus(204);
    })
    // send an error if not
    .catch((err) => console.log(err));
});

// SHOW route
// Read -> finds and displays a single resource
router.get("/:id", (req, res) => {
  // get the id -> save to a variable
  const id = req.params.id;
  // use a mongoose method to find using that id
  Car.findById(id)
    // send the car as json upon success
    .then((car) => {
      res.json({ car: car });
    })
    // catch any errors
    .catch((err) => console.log(err));
});

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router;