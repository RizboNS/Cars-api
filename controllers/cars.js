const Car = require("../models/car");
const User = require("../models/user");
const path = require("path");
const fs = require("fs");
module.exports = {
  index: async (req, res, next) => {
    // Get all cars
    const cars = await Car.find();
    res.status(200).json(cars);
  },
  newCar: async (req, res, next) => {
    // Find seller
    const seller = await User.findById(req.value.body.seller);
    // Create a new car
    const newCar = req.value.body;
    delete newCar.seller;
    const car = new Car(newCar);
    car.seller = seller;
    await car.save();
    // Add new car to the seller
    seller.cars.push(car);
    await seller.save();
    //  Response
    res.status(200).json(car);
  },
  getCar: async (req, res, next) => {
    const { carId } = req.value.params;
    const car = await Car.findById(carId);
    res.status(200).json(car);
  },
  replaceCar: async (req, res, next) => {
    const { carId } = req.value.params;
    const newCar = req.value.body;
    const result = await Car.findByIdAndUpdate(carId, newCar);
    res.status(200).json({ success: true });
  },
  updateCar: async (req, res, next) => {
    const { carId } = req.value.params;
    const newCar = {
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      rangeDriven: req.body.rangeDriven,
      price: req.body.price,
      fuelSystem: req.body.fuelSystem,
      bodyType: req.body.bodyType,
      horsePower: req.body.horsePower,
      engineDisplacement: req.body.engineDisplacement,
      equipment: req.body.equipment,
      transitionType: req.body.transitionType,
      sellerPhone: req.body.sellerPhone,
      sellerEmail: req.body.sellerEmail,
      sellerComment: req.body.sellerComment,
    };
    const car = await Car.findByIdAndUpdate(carId, newCar);
    req.files.forEach(async (file) => {
      let imageExist = false;
      car.images.forEach((img) => {
        if (img.fileName === file.filename) {
          imageExist = true;
        }
      });
      if (!imageExist) {
        // const imagePath = "http://localhost:3000/images/" + file.filename;
        const imagePath = path.join(__dirname, "..", "images", file.filename);
        car.images.push({
          imagePath: imagePath,
          fileName: file.filename,
        });
      }
    });
    await car.save();
    res.status(200).json({ success: true });
  },
  deleteCar: async (req, res, next) => {
    const { carId } = req.value.params;
    // Get a car
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Car does not exist" });
    }
    const sellerId = car.seller;
    // Get a seller
    const seller = await User.findById(sellerId);
    // Remove images if car has any
    car.images.forEach((image) => {
      fs.unlink(image.imagePath, (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({ success: false });
        }
      });
    });
    // Remove car
    await car.remove();
    // Remove car from the sellers selling list
    seller.cars.pull(car);
    await seller.save();
    res.status(200).json({ success: true });
  },
  getCarImage: async (req, res, next) => {
    // console.log(req.params.imageId);
    const { imageId } = req.params;
    const { carId } = req.params;
    const car = await Car.findById(carId);
    car.images.forEach((image) => {
      if (image._id == imageId) {
        res.status(200).sendFile(image.imagePath);
      }
    });
  },
  removeImage: async (req, res, next) => {
    const { imageFileName } = req.params;
    const { carId } = req.params;
    const car = await Car.findById(carId);
    car.images.forEach((image) => {
      if (image.fileName == imageFileName) {
        car.images.remove(image);
        fs.unlink(image.imagePath, (err) => {
          if (err) {
            console.log(err);
            res.status(400).json({ success: false });
          } else {
            car.save();
            res.status(200).json({ success: true });
          }
        });
      }
    });
  },
};
