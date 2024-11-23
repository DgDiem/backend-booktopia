const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
  day: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.comment || mongoose.model("comment", commentSchema);
