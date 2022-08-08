const User = require('../models/user')
const Car = require('../models/car')

module.exports = {
    // Get all users - Validation (done)
    index: async (req, res, next) => {
        const users = await User.find()
        res.status(200).json(users)
    },
    // Create new user - Validation (done)
    newUser: async (req, res, next) => {
        const newUser = new User(req.value.body)
        // const newUser = new User(req.body)
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    },
    // Get user by userId - Validation (done)
    getUser: async (req, res, next) => {
        const { userId } = req.value.params
        // const { userId } = req.params
        const user = await User.findById(userId)
        res.status(200).json(user)
    },
    // Validation (done)
    replaceUser: async (req, res, next) => {
        const { userId } = req.value.params
        const newUser = req.value.body
        const result = await User.findByIdAndUpdate(userId, newUser)
        res.status(200).json({success: true})
    },
    // Validation (done)
    updateUser: async (req, res, next) => {
        const { userId } = req.value.params
        const newUser = req.value.body
        const result = await User.findByIdAndUpdate(userId, newUser)
        res.status(200).json({success: true})
    },
    // Validation (done)
    getUserCars: async (req, res, next) => {
        const { userId } = req.value.params
        const user = await User.findById(userId).populate('cars')
        res.status(200).json(user.cars)
    },
    // Validation (done)
    newUserCar: async (req, res, next) => {
        const { userId } = req.value.params
        const newCar = new Car(req.value.body)
        const user = await User.findById(userId)
        newCar.seller = user
        await newCar.save()
        user.cars.push(newCar)
        await user.save()
        res.status(201).json(newCar)
    }
}