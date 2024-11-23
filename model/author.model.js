const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const authorSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: false },
});

module.exports =
  mongoose.models.authors || mongoose.model("authors", authorSchema);
