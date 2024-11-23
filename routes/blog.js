var express = require("express");
var router = express.Router();
const blogController = require("../controller/blog.controller");
const upload = require("../helper/upload");
const authen = require("../middleware/authen");

//hiển tất cả bài viết
router.get("/", async (req, res) => {
  try {
    const blog = await blogController.getAll();
    return res.status(200).json(blog);
  } catch (error) {
    console.log("Không load được bài viết", error);
    res.status(500).json({ mess: error });
  }
});

//hiển thị bài viết theo id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const results = await blogController.getBlogById(id);
    return res.status(200).json(results);
  } catch (error) {
    console.log("Không load được bài viết", error);
    res.status(500).json({ mess: error.message });
  }
});

//thêm bài viết mới
router.post("/", upload.single("image"),[authen([1])], async (req, res) => {
  try {
    const body = req.body;
    // Kiểm tra xem req.file có tồn tại không trước khi truy cập thuộc tính originalname
    if (req.file && req.file.originalname) {
      body.image = req.file.originalname;
    }
    const result = await blogController.insert(body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Không thêm được bài viết", error);
    res.status(500).json({ mess: error });
  }
});

//sửa bài viết
router.put("/:id", upload.single("image"),[authen([1])], async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    // Kiểm tra xem req.file có tồn tại không trước khi truy cập thuộc tính originalname
    if (req.file && req.file.originalname) {
      body.image = req.file.originalname;
    }
    const blogUpdate = await blogController.updateById(id, body);
    return res.status(200).json(blogUpdate);
  } catch (error) {
    console.log("Không sửa được bài viết", error);
    return res.status(500).json({ mess: error });
  }
});

//xóa bài viết
router.delete("/:id",[authen([1])], async (req, res) => {
  try {
    const { id } = req.params;
    const blogDel = await blogController.remove(id);
    console.log("Xóa bài viết thành công");
    return res.status(200).json(blogDel);
  } catch (error) {
    console.log("Không xóa được bài viết", error);
    return res.status(500).json({ mess: error });
  }
});

//tìm kiếm bài viết theo tên
router.get("/search/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    const results = await blogController.findByName(name);
    return res.status(200).json(results);
  } catch (error) {
    console.log("Không tìm được bài viết", error);
    return res.status(500).json({ mess: error });
  }
});

//lọc bài viết mới
router.get("/blog/new", async (req, res) => {
  try {
    const result = await blogController.getNewBlog();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Không lấy được bài viết mới", error);
    return res.status(500).json({ mess: error });
  }
});

module.exports = router;
