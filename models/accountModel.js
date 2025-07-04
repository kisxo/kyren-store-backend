const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Account name is required"],
  },
  price: {
    type: Number,
    require: [true, "Account price is required"],
  },
  image: {
    type: String,
    require: [true, "Account image is required"],
  },
  desc: {
    type: String,
  },
  category: {
    type: String,
  },
  gameName: {
    type: String,
  },
  socialName: {
    type: String,
  },
  region: {
    type: String,
    default: "none",
  },
  status: {
    type: String,
    default: "none",
  },
});

const accountModel = mongoose.model("account", accountSchema);
module.exports = accountModel;
