const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1, // Tối thiểu là 1 sao
    max: 5, // Tối đa là 5 sao
  },
  day: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.review || mongoose.model("review", reviewSchema);
