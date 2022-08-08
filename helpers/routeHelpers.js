const Joi = require('joi')


module.exports = {
    validateParam: (schema, name) => {
        return (req, res, next) => {
            console.log('req.params', req.params)
            const result = schema.validate({param: req['params'][name]})
            if (result.error) {
                return res.status(400).json(result.error)
            } else {
                if (!req.value)
                    req.value = {}
                if (!req.value['params'])
                    req.value['params'] = {}

                req.value['params'][name] = result.value.param
                next()
            }
        }
    },
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body)
            if (result.error) {
                return res.status(400).json(result.error)
            } else {
                if (!req.value)
                    req.value = {}
                if (!req.value['body'])
                    req.value['body'] = {}

                req.value['body'] = result.value
                next()
            }
        }
    },
    schemas: {
        userOptionalSchema: Joi.object().keys({
            firstName: Joi.string(),
            lastName: Joi.string(),
            email: Joi.string().email()
        }),
        userSchema: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().email().required()
        }),
        carSchema: Joi.object().keys({
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required(),
        }),
        newCarSchema: Joi.object().keys({
            seller: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
            make: Joi.string().required(),
            model: Joi.string().required(),
            year: Joi.number().required(),
        }),
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        })
    }
}