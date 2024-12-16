const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  name: { type: String, required: true },
  image1: { type: String, required: true },
  image2: { type: String, required: false },
  image3: { type: String, required: false },
  image4: { type: String, required: false },
  price1: { type: Number, required: true },
  price2: { type: Number, required: false },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  sale: { type: Number, default: 0 },
  hot: { type: Number, default: 0 },
  view: { type: Number, default: 0 },
  publish: {
    type: {
      publishId: { type: ObjectId, required: true },
      publishName: { type: String, required: true },
    },
    required: true,
  },
  author: {
    type: {
      authorId: { type: ObjectId, required: true },
      authorName: { type: String, required: true },
    },
    required: true,
  },
  category: {
    type: {
      categoryId: { type: ObjectId, required: true },
      categoryName: { type: String, required: true },
    },
    required: true,
  },
  isActive: { type: Boolean, default: true },
});

module.exports =
  mongoose.models.pros || mongoose.model("products", productSchema);
