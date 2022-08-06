const User = require('../models/user')


module.exports = {
    index: async (req, res, next) => {
        try {
            const users = await User.find()
            res.status(200).json(users)
        } catch (err) {
            next(err)
        }
    },
    newUser: async (req, res, next) => {
        const newUser = new User(req.body)
        try {
            const savedUser = await newUser.save()
            res.status(200).json(savedUser)
        } catch (err) {
            next(err)
        }
    }
}