var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

// Import route modules
var usersRouter = require("./routes/users");
var cataRouter = require("./routes/category");
var listproRouter = require("./routes/products");
var publishRouter = require("./routes/publish");
var authorRouter = require("./routes/author");
var blogRouter = require("./routes/blog");
var orderRouter = require("./routes/order");
var commentRouter = require("./routes/comment");
var reviewRouter = require("./routes/review");
var favoriteRouter = require("./routes/favorite");
var voucherRouter = require("./routes/voucher");
var contactRouter = require("./routes/contact");

var app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json()); // Use built-in express.json() instead of body-parser
app.use(express.urlencoded({ extended: false })); // Use express.urlencoded() instead of body-parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS for all domains or specify allowed domains
app.use(cors());

// Connect to MongoDB

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log("Kết nối database thành công"))
  .catch((err) => {
    console.error("Kết nối database thất bại", err);
    process.exit(1); // Exit application if DB connection fails
  });

// Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/booktopia")
//   .then(() => console.log("Kết nối database thành công"))
//   .catch((err) => {
//     console.error("Kết nối database thất bại", err);
//     process.exit(1); // Exit application if DB connection fails
//   });

// Routes
app.use("/users", usersRouter);
app.use("/category", cataRouter);
app.use("/products", listproRouter);
app.use("/publishes", publishRouter);
app.use("/authors", authorRouter);
app.use("/blog", blogRouter);
app.use("/orders", orderRouter);
app.use("/comment", commentRouter);
app.use("/review", reviewRouter);
app.use("/favorites", favoriteRouter);
app.use("/vouchers", voucherRouter);
app.use("/contact", contactRouter);

// 404 handler
app.use(function (req, res, next) {
  res.status(404).json({ message: "Không tìm thấy tài nguyên" });
});

// Global error handler
app.use(function (err, req, res, next) {
  console.error(err.stack); // Log error stack trace for debugging
  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}, // Show detailed error in dev mode
  });
});

module.exports = app;
