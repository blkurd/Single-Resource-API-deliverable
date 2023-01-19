
//// Our schema and model for the car resource          
const mongoose = require('mongoose') // import mongoose

// we'll destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// cars schema
const carSchema = new Schema({
    name: String,
    color: String,
    readyToRide: Boolean
})

// make the car model
// the model method takes two arguments
// the first is what we call our model
// the second is the schema used to build the model
const Car = model('Car', carSchema)


// Export our Model 

module.exports = Car;