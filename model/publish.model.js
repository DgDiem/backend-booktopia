// kết nối collection publish

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const publishSchema = new Schema({
  name: { type: String, require: true },
  description: { type: String, require: false },
});

module.exports =
  mongoose.models.publishes || mongoose.model("publishes", publishSchema);
