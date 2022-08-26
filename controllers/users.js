const User = require("../models/user");
const Car = require("../models/car");
const Image = require("../models/image");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

module.exports = {
  index: async (req, res, next) => {
    const users = await User.find();
    res.status(200).json(users);
  },
  newUser: async (req, res, next) => {
    req.value.body.email = req.value.body.email.toLowerCase();
    const emailExist = await User.findOne({ email: req.value.body.email });
    if (emailExist) return res.status(400).send("Email already exist");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.value.body.password, salt);
    req.value.body.password = hashedPassword;
    const newUser = new User(req.value.body);
    const savedUser = await newUser.save();
    const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET);
    res.status(201).send({ token });
    // res.status(201).json({userId: savedUser._id})
  },
  userLogin: async (req, res, next) => {
    req.value.body.email = req.value.body.email.toLowerCase();
    const user = await User.findOne({ email: req.value.body.email });
    if (!user) return res.status(400).send("Email or password invalid");
    const validPass = await bcrypt.compare(
      req.value.body.password,
      user.password
    );
    if (!validPass) return res.status(400).send("Email or password invalid");
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    // res.header('auth-token', token).send({token})
    res.status(201).send({ token });
  },
  getUser: async (req, res, next) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId);
    res.status(200).json(user);
  },
  replaceUser: async (req, res, next) => {
    const { userId } = req.value.params;
    const newUser = req.value.body;
    const result = await User.findByIdAndUpdate(userId, newUser);
    res.status(200).json({ success: true });
  },
  updateUser: async (req, res, next) => {
    const { userId } = req.value.params;
    const newUser = req.value.body;
    const result = await User.findByIdAndUpdate(userId, newUser);
    res.status(200).json({ success: true });
  },
  getUserCars: async (req, res, next) => {
    const { userId } = req.value.params;
    const user = await User.findById(userId).populate("cars");
    res.status(200).json(user.cars);
  },
  newUserCar: async (req, res, next) => {
    const reqId = res.locals.user._id;
    const { userId } = req.value.params;
    if (reqId === userId) {
      const newCar = new Car({
        make: req.value.body.make,
        model: req.value.body.model,
        year: req.value.body.year,
        images: [],
        color: req.value.body.color,
        rangeDriven: req.value.body.rangeDriven,
        price: req.value.body.price,
        fuelSystem: req.value.body.fuelSystem,
        bodyType: req.value.body.bodyType,
        horsePower: req.value.body.horsePower,
        engineDisplacement: req.value.body.engineDisplacement,
        transitionType: req.value.body.transitionType,
        equipment: req.value.body.equipment,
        sellerPhone: req.value.body.sellerPhone,
        sellerEmail: req.value.body.sellerEmail,
        sellerComment: req.value.body.sellerComment,
      });
      req.files.forEach(async (file) => {
        // const imagePath = "http://localhost:3000/images/" + file.filename;
        const imagePath = path.join(__dirname, "..", "images", file.filename);
        newCar.images.push({
          imagePath: imagePath,
        });
      });
      const user = await User.findById(userId);
      newCar.seller = user;
      await newCar.save();
      user.cars.push(newCar);
      await user.save();
      res.status(201).json(newCar);
    } else {
      res.status(400).json("Access denied only user owner can create car!");
    }
  },
};
