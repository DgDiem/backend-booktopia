const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema({
  orderId: { type: String, require: true },
  name: { type: String, require: true },
  phone: { type: String, require: true },
  address: { type: String, require: true },
  email: { type: String, require: true },
  description: { type: String, require: false, default: null },
  date: { type: Date, default: Date.now },
  total: { type: String, require: true },
  listProducts: [
    {
      name: { type: String, required: true },
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
      image1: { type: String, required: false },
      price2: { type: Number, required: true },
      price1: { type: Number, required: true },
      quantity: { type: Number, required: true },
      reviewStatus: {
        type: String,
        enum: ["Chưa đánh giá", "Đã đánh giá"],
        default: "Chưa đánh giá",
      },
    },
  ],

  updatedAt: { type: Date, default: Date.now },
  userId: { type: ObjectId, ref: "users", required: false },
  paymentStatus: {
    type: String,
    enum: ["Đã thanh toán", "Chưa thanh toán"],
  },
  status: {
    type: String,
    enum: [
      "Chờ xác nhận",
      "Đang xử lý",
      "Đang vận chuyển",
      "Giao thành công",
      "Đã hủy",
    ],
    default: "Chờ xác nhận",
  },
});

module.exports = mongoose.models.order || mongoose.model("orders", orderSchema);
