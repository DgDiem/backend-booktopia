var express = require("express");
var router = express.Router();
const commentController = require("../controller/comment.controller");
const authen = require("../middleware/authen");

// Show tất cả bình luận
router.get("/", async (req, res) => {
  try {
    const comments = await commentController.getAllComments();
    return res.status(200).json(comments);
  } catch (error) {
    console.log("Lỗi lấy bình luận", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Lấy tất cả bình luận của một sản phẩm
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await commentController.getCommentsByProduct(productId);
    return res.status(200).json(comments);
  } catch (error) {
    console.log("Lỗi lấy bình luận theo sản phẩm", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Thêm bình luận mới
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await commentController.insertComment(body);
    return res.status(201).json(result); // Thường dùng mã 201 khi tạo mới thành công
  } catch (error) {
    console.log("Lỗi thêm bình luận", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Cập nhật bình luận theo id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedComment = await commentController.updateCommentById(id, body);
    return res.status(200).json(updatedComment);
  } catch (error) {
    console.log("Lỗi cập nhật bình luận", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Chi tiết bình luận theo id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await commentController.getCommentById(id);
    return res.status(200).json(comment);
  } catch (error) {
    console.log("Lỗi lấy chi tiết bình luận", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Xóa bình luận theo id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await commentController.deleteComment(id);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi xóa bình luận", error);
    return res.status(500).json({ mess: error.message });
  }
});

module.exports = router;
