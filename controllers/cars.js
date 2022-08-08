const Car = require('../models/car')
const User = require('../models/user')

module.exports = {
    index: async (req, res, next) => {
        // Get all cars
        const cars = await Car.find()
        res.status(200).json(cars)
    },
    newCar: async (req, res, next) => {
        // Find seller
        const seller = await User.findById(req.value.body.seller)
        // Create a new car
        const newCar = req.value.body
        delete newCar.seller
        const car = new Car(newCar)
        car.seller = seller
        await car.save()
        // Add new car to the seller
        seller.cars.push(car)
        await seller.save()
        //  Response
        res.status(200).json(car)
    }
}