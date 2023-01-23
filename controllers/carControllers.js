/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Car = require('../models/car')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////

// INDEX route 
// Read -> finds and displays all cars
router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the cars
    Car.find({})
        // there's a built in function that runs before the rest of the promise chain
        // this function is called populate, and it's able to retrieve info from other documents in other collections
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        // send json if successful
        .then(cars => { 
            // res.json({ cars: cars })
            // now that we have liquid installed, we're going to use render as a response for our controllers
            res.render('cars/index', { cars, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET for the new page
// shows a form where a user can create a new car
router.get('/new', (req, res) => {
    res.render('cars/new', { ...req.session })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // console.log('this is req.body before owner: \n', req.body)
    // here, we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    // we want to add an owner field to our car
    // luckily for us, we saved the user's id on the session object, so it's really easy for us to access that data
    req.body.owner = req.session.userId

    // we need to do a little js magic, to get our checkbox turned into a boolean
    // here we use a ternary operator to change the on value to send as true
    // otherwise, make that field false
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    const newCar = req.body
    console.log('this is req.body aka newCar, after owner\n', newCar)
    Car.create(newCar)
        // send a 201 status, along with the json response of the new car
        .then(car => {
            // in the API server version of our code we sent json and a success msg
            // res.status(201).json({ car: car.toObject() })
            // we could redirect to the 'mine' page
            // res.status(201).redirect('/cars/mine')
            // we could also redirect to the new car's show page
            res.redirect(`/cars/${car.id}`)
        })
        // send an error if one occurs
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's cars
router.get('/mine', (req, res) => {
    // find cars by ownership, using the req.session info
    Car.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(cars => {
            // if found, display the cars
            // res.status(200).json({ cars: cars })
            res.render('cars/index', { cars, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route for getting json for specific user cars
// Index -> This is a user specific index route
// this will only show the logged in user's cars
router.get('/json', (req, res) => {
    // find cars by ownership, using the req.session info
    Car.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(cars => {
            // if found, display the cars
            res.status(200).json({ cars: cars })
            // res.render('cars/index', { cars, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})

// GET request -> edit route
// shows the form for updating a car
router.get('/edit/:id', (req, res) => {
    // because we're editing a specific car, we want to be able to access the car's initial values. so we can use that info on the page.
    const carId = req.params.id
    Car.findById(carId)
        .then(car => {
            res.render('cars/edit', { car, ...req.session })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

// PUT route
// Update -> updates a specific car(only if the car's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    Car.findById(id)
        .then(car => {
            // if the owner of the car is the person who is logged in
            if (car.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // update and save the car
                return car.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20car`)
            }
        })
        .then(() => {
            // console.log('the car?', car)
            res.redirect(`/cars/mine`)
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// DELETE route
// Delete -> delete a specific car
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Car.findById(id)
        .then(car => {
            // if the owner of the car is the person who is logged in
            if (car.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // delete the car
                return car.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20car`)
            }
        })
        .then(() => {
            res.redirect('/cars/mine')
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Car.findById(id)
        .populate('comments.author', 'username')
        // send the car as json upon success
        .then(car => {
            // res.json({ car: car })
            res.render('cars/show.liquid', {car, ...req.session})
        })
        // catch any errors
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router