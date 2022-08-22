const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carSchema = new Schema({
  make: String,
  model: String,
  year: Number,
  seller: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  images: [
    {
      imagePath: { type: String, required: true },
    },
  ],
});

const Car = mongoose.model("car", carSchema);
module.exports = Car;
