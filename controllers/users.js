const User = require('../models/user')


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
    }
}