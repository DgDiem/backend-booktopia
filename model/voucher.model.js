const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voucherSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true, 
  },
  type: {
    type: String,
    enum: ["Discount", "Shipping"], 
    required: true,
  },
  minimumOrderValue: {
    type: Number,
    required: true, 
  },
  effectiveDate: {
    type: Date,
    required: true, 
  },
  expirationDate: {
    type: Date,
    required: true, 
  },
  discountValue: {
    type: Number,
    required: true, 
  },
  isActive: {
    type: Boolean,
    default: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

module.exports = mongoose.models.voucher || mongoose.model("voucher", voucherSchema);
