var express = require("express");
var router = express.Router();
const reviewController = require("../controller/review.controller");
const authen = require("../middleware/authen");

// Show tất cả bình luận
router.get("/", async (req, res) => {
  try {
    const reviews = await reviewController.getAllReviews();
    return res.status(200).json(reviews);
  } catch (error) {
    console.log("Lỗi lấy bình luận", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Lấy tất cả bình luận của một sản phẩm
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewController.getReviewByProduct(productId);
    return res.status(200).json(reviews);
  } catch (error) {
    console.log("Lỗi lấy bình luận theo sản phẩm", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Thêm bình luận mới
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await reviewController.insertReview(body);
    return res.status(201).json(result); // Thường dùng mã 201 khi tạo mới thành công
  } catch (error) {
    console.log("Lỗi thêm đánh giá", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Cập nhật bình luận theo id
// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const body = req.body;
//     const updatedComment = await commentController.updateCommentById(id, body);
//     return res.status(200).json(updatedComment);
//   } catch (error) {
//     console.log("Lỗi cập nhật bình luận", error);
//     return res.status(500).json({ mess: error.message });
//   }
// });

// Chi tiết bình luận theo id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await reviewController.getReviewById(id);
    return res.status(200).json(review);
  } catch (error) {
    console.log("Lỗi lấy chi tiết bình luận", error);
    return res.status(500).json({ mess: error.message });
  }
});

// Xóa bình luận theo id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await reviewController.deleteReview(id);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lỗi xóa đánh giá", error);
    return res.status(500).json({ mess: error.message });
  }
});

module.exports = router;
