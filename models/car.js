const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: String,
  model: String,
  year: String,
  color: String,
  rangeDriven: String,
  price: String,
  fuelSystem: String,
  bodyType: String,
  horsePower: String,
  engineDisplacement: String,
  transitionType: String,
  equipment: [
    {
      type: String,
    },
  ],
  sellerPhone: String,
  sellerEmail: String,
  sellerComment: String,
  seller: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  images: [
    {
      imagePath: { type: String, required: true },
      fileName: { type: String, required: true },
    },
  ],
});

const Car = mongoose.model("car", carSchema);
module.exports = Car;
