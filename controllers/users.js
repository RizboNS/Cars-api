const User = require('../models/user')
const Car = require('../models/car')

module.exports = {
    // Get all users
    index: async (req, res, next) => {
        const users = await User.find()
        res.status(200).json(users)
    },
    // Create new user
    newUser: async (req, res, next) => {
        const newUser = new User(req.body)
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    },
    // Get user by userId
    getUser: async (req, res, next) => {
        const { userId } = req.value.params
        // const { userId } = req.params
        const user = await User.findById(userId)
        res.status(200).json(user)
    },
    replaceUser: async (req, res, next) => {
        const { userId } = req.params
        const newUser = req.body
        const result = await User.findByIdAndUpdate(userId, newUser)
        res.status(200).json({success: true})
    },
    updateUser: async (req, res, next) => {
        const { userId } = req.params
        const newUser = req.body
        const result = await User.findByIdAndUpdate(userId, newUser)
        res.status(200).json({success: true})
    },
    getUserCars: async (req, res, next) => {
        const { userId } = req.params
        const user = await User.findById(userId).populate('cars')
        res.status(200).json(user.cars)
    },
    newUserCar: async (req, res, next) => {
        const { userId } = req.params
        const newCar = new Car(req.body)
        const user = await User.findById(userId)
        newCar.seller = user
        await newCar.save()
        user.cars.push(newCar)
        await user.save()
        res.status(201).json(newCar)
    }
}