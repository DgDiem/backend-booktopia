const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const categorySchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: true },
  isActive: { type: Boolean, default: true },
});

module.exports =
  mongoose.models.categories || mongoose.model("categories", categorySchema);
