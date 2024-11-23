var express = require("express");
var router = express.Router();
const orderController = require("../controller/order.controller");
const authen = require("../middleware/authen");

router.get("/", async (req, res) => {
  try {
    const result = await orderController.getAll();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lấy danh sách đơn hàng không thành công", error);
    res.status(500).json({ mess: error });
  }
});
router.get("/pending", async (req, res) => {
  try {
    const result = await orderController.getPendingOrders();
    return res.status(200).json(result);
  } catch (error) {
    console.log("Lấy danh sách đơn hàng chờ xác nhận không thành công", error);
    res.status(500).json({ mess: error });
  }
});
router.post("/", async (req, res) => {
  try {
    const result = await orderController.create(req, res);
    return res.status(201).json(result);
  } catch (error) {
    console.log("Tạo đơn hàng không thành công", error); 
    res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await orderController.updateOrderStatus(id, status);
    return res.status(200).json({ updatedOrder });
  } catch (error) {
    console.log("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const updatedOrder = await orderController.updateOrderInfo(id, body);
    return res.status(200).json({ updatedOrder });
  } catch (error) {
    console.log("Lỗi khi chỉnh sửa thông tin đơn hàng:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const canceledOrder = await orderController.cancelOrder(id);
    return res.status(200).json({ canceledOrder });
  } catch (error) {
    console.log("Lỗi khi hủy đơn hàng:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderController.getOrdersByUserId(userId);
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderController.getOrderById(id);
    return res.status(200).json(order);
  } catch (error) {
    console.log("Lỗi lấy chi tiết đơn hàng", error);
    return res.status(500).json(error);
  }
});
router.get("/status/:userId/:productId", async (req, res) => {
  try {
    // Gọi controller mà không trả kết quả lại trong route
    await orderController.getOrderStatusByProduct(req, res);
  } catch (error) {
    console.log("Lỗi khi lấy trạng thái đơn hàng:", error);
    return res.status(500).json({ message: error.message });
  }
});
// Route cập nhật đánh giá
router.put("/review/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Tìm đơn hàng của người dùng có chứa sản phẩm và trạng thái "Giao thành công"
    const order = await orderModel.findOne({
      "listProducts._id": productId,
    });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong đơn hàng." });
    }

    const product = order.listProducts.find((item) => item._id.toString() === productId);

    if (product.reviewStatus === "Đã đánh giá") {
      return res.status(400).json({ message: "Sản phẩm này đã được đánh giá." });
    }
    const result = await orderModel.updateOne(
      { "listProducts._id": productId },
      { $set: { "listProducts.$.reviewStatus": "Đã đánh giá" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật." });
    }

    return res.status(200).json({ message: "Đánh giá đã được ghi nhận." });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đánh giá:", error);
    return res.status(500).json({ message: error.message });
  }
});


module.exports = router;
