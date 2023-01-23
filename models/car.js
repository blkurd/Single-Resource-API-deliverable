


const mongoose = require('../utils/connection') // import mongoose

// we'll destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose
const commentSchema = require ("./comment")

// cars schema
const carSchema = new Schema({
    name: {
        type: String
    },
    color: {
        type: String
    },
    readyToRide: {
        type: Boolean
    },
    owner: {
        // this is where we set up an objectId reference
        // by declaring that as the type
        type: Schema.Types.ObjectId,
        // this line tells us which model to look at
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })



// make the car model
// the model method takes two arguments
// the first is what we call our model
// the second is the schema used to build the model
const Car = model('Car', carSchema)


// Export our Model 

module.exports = Car;
