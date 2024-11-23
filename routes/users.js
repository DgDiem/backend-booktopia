var express = require("express");
var router = express.Router();
const usersController = require("../controller/user.controller");
const checktoken = require("../helper/checktoken");
const jwt = require("jsonwebtoken");
const upload = require("../helper/upload");
const authen = require("../middleware/authen");

// Đăng ký
router.post("/register", async (req, res) => {
  try {
    const body = req.body;
    const result = await usersController.register(body);
    return res.status(201).json(result); // 201 Created
  } catch (error) {
    console.log("Đăng ký không thành công", error);
    return res.status(400).json({ message: error.message || "Lỗi đăng ký" });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const body = req.body;
    const result = await usersController.login(body);
    return res.status(200).json(result);
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập" });
  }
});

// cap nhat
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    if (req.file) {
      body.image = req.file.originalname;
    } else {
      delete body.image;
    }
    const userUpdate = await usersController.updateById(id, body);
    return res.status(200).json({ userUpdate });
  } catch (error) {
    console.log("lỗi update user ", error);
    return res.status(400).json({ message: error.message || "Lỗi cập nhật user" });
  }
});

// Lấy chi tiết user
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const users = await usersController.getUserById(id);
    return res.status(200).json(users);
  } catch (error) {
    console.log("Lỗi lấy chi tiết User", error);
    return res.status(404).json({ message: error.message || "Không tìm thấy user" });
  }
});

// Refresh token
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token không tồn tại" });
    }

    // Xác thực refreshToken
    jwt.verify(refreshToken, "refresh_token_secret", (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Refresh token không hợp lệ" });
      } else {
        // Tạo accessToken mới
        const user = decoded;
        const accessToken = jwt.sign(
          { _id: user._id, email: user.email, role: user.role },
          "access_token_secret",
          { expiresIn: "1m" }
        );

        // Trả về accessToken mới
        return res.status(200).json({ user, accessToken: accessToken, refreshToken: refreshToken });
      }
    });
  } catch (error) {
    console.log("Lỗi refresh token:", error);
    return res.status(500).json({ message: error.message || "Lỗi hệ thống" });
  }
});

// Lấy tất cả users
router.get("/", async (req, res) => {
  try {
    const users = await usersController.gettAll();
    return res.status(200).json(users);
  } catch (error) {
    console.log("Load user không thành công", error);
    return res.status(500).json({ message: error.message || "Lỗi khi lấy danh sách users" });
  }
});

//routing xóa user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userDel = await usersController.remove(id);
    if (!userDel) {
      return res.status(404).json({ message: "Không tìm thấy user để xóa" });
    }
    console.log("Xóa user thành công");
    return res.status(200).json({ UserDelete: userDel });
  } catch (error) {
    console.log("lỗi xóa user theo id", error);
    return res.status(500).json({ message: error.message || "Lỗi xóa user" });
  }
});

module.exports = router;
