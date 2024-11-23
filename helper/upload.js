const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname); // Sử dụng tên file gốc
  },
});

var checkFile = (req, file, callback) => {
  if (!file.originalname.match(/\.(png|jpg|webp|gif)$/)) {
    return callback(new Error("Vui lòng chọn file hình ảnh"));
  }
  return callback(null, true);
};

module.exports = multer({
  storage: storage,
  fileFilter: checkFile,
});
