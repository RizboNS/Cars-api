const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const cors = require('cors')
require('dotenv/config')
const app = express()
app.use(helmet())


// DB Connect
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(
console.log('Connected to the DB!')
)
.catch(err => console.log(err))

// Security

// Routes
const users = require('./routes/users')
const cars = require('./routes/cars')

// Middlewares
app.use(cors())
app.use(logger('dev'))
app.use(bodyParser.json())

// Routes
app.use('/users', users)
app.use('/cars', cars)

// Catch 404 Errors and forward them to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

// Error handler function
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err: {}
    const status = err.status || 500
    // Respond to client
    res.status(status).json({
        error: {
            message: error.message
        }
    })

    // Respond to ourselves
    console.error(err)
})

// Start the server
const port = app.get('port') | 3000
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
    }
)