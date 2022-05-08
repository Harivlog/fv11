var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(adSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },
    sale: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)),
  (Ad = mongoose.model("ad", adSchema));

module.exports = Ad;
