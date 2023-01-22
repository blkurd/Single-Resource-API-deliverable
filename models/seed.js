/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Car = require('./car')

/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
    // array of starter resources(cars)
    const cars = [
        { name: "Ferari", color: "red", readyToRide: true },
        { name: "Volvo", color: "black", readyToRide: true },
        { name: "BMW", color: "blue", readyToRide: false },
      ];
    // then we delete every car in the database(all instances of this resource)
    // this will delete any cars that are not owned by a user
    Car.deleteMany({ owner: null })
        .then(() => {
            // then we'll seed(create) our starter cars
            Car.create(cars)
                // tell our app what to do with success and failures
                .then(data => {
                    console.log('here are the created cars: \n', data)
                    // once it's done, we close the connection
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    // always close the connection
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            // always make sure to close the connection
            db.close()
        })
})