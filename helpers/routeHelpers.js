const Joi = require("joi");

module.exports = {
  validateParam: (schema, name) => {
    return (req, res, next) => {
      console.log("req.params", req.params);
      const result = schema.validate({ param: req["params"][name] });
      if (result.error) {
        return res.status(400).json(result.error.details[0].message);
      } else {
        if (!req.value) req.value = {};
        if (!req.value["params"]) req.value["params"] = {};

        req.value["params"][name] = result.value.param;
        next();
      }
    };
  },
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = schema.validate(req.body);
      if (result.error) {
        return res.status(400).json(result.error.details[0].message);
      } else {
        if (!req.value) req.value = {};
        if (!req.value["body"]) req.value["body"] = {};

        req.value["body"] = result.value;
        next();
      }
    };
  },
  schemas: {
    userOptionalSchema: Joi.object().keys({
      firstName: Joi.string().min(2),
      lastName: Joi.string().min(2),
      email: Joi.string().email(),
      password: Joi.string().min(6),
    }),
    userSchema: Joi.object().keys({
      firstName: Joi.string().min(2).required(),
      lastName: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
    userLoginSchema: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
    userCarSchema: Joi.object().keys({
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.string().required(),
      color: Joi.string().required(),
      rangeDriven: Joi.string().required(),
      price: Joi.string().required(),
      fuelSystem: Joi.string().required(),
      bodyType: Joi.string().required(),
      horsePower: Joi.string().required(),
      engineDisplacement: Joi.string().required(),
      transitionType: Joi.string().required(),
      equipment: Joi.string().allow("").optional(),
      sellerPhone: Joi.string().required(),
      sellerEmail: Joi.string().required(),
      sellerComment: Joi.string().required(),
      images: {
        imagePath: Joi.string().required(),
        fileName: Joi.string(),
      },
    }),
    carSchema: Joi.object().keys({
      seller: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().required(),
    }),
    putCarSchema: Joi.object().keys({
      make: Joi.string().required(),
      model: Joi.string().required(),
      year: Joi.number().required(),
    }),
    patchCarSchema: Joi.object().keys({
      make: Joi.string(),
      model: Joi.string(),
      year: Joi.string(),
      color: Joi.string(),
      rangeDriven: Joi.string(),
      price: Joi.string(),
      fuelSystem: Joi.string(),
      bodyType: Joi.string(),
      horsePower: Joi.string(),
      engineDisplacement: Joi.string(),
      transitionType: Joi.string(),
      equipment: Joi.array().items(Joi.string()),
      sellerPhone: Joi.string(),
      sellerEmail: Joi.string(),
      sellerComment: Joi.string(),
      images: {
        imagePath: Joi.string().required(),
        fileName: Joi.string(),
      },
    }),
    idSchema: Joi.object().keys({
      param: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    }),
  },
};
