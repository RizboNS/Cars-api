const Car = require('../models/car')


module.exports = {
    index: async (req, res, next) => {
        // Get all cars
        const cars = await Car.find()
        res.status(200).json(cars)
    }
}