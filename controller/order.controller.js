const orderModel = require("../model/order.model");
const mongoose = require("mongoose");
module.exports = {
  create,
  getAll,
  updateOrderStatus,
  updateOrderInfo,
  cancelOrder,
  getOrdersByUserId,
  getOrderById,
  getPendingOrders,
  getOrderStatusByProduct,
  handleReview,
};

async function getAll() {
  try {
    const result = await orderModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách đơn hàng", error);
    throw error;
  }
}

async function getPendingOrders() {
  try {
    const result = await orderModel
      .find({ status: "Chờ xác nhận" })
      .sort({ date: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách đơn hàng chờ xác nhận", error);
    throw error;
  }
}
async function create(req, res) {
  try {
    const {
      name,
      phone,
      address,
      email,
      description,
      date,
      total,
      listProducts,
      userId,
      paymentStatus,
    } = req.body;

    const dateObject = new Date();
    const day = ("0" + dateObject.getDate()).slice(-2);
    const month = ("0" + (dateObject.getMonth() + 1)).slice(-2);
    const year = dateObject.getFullYear();
    const datePart = `${day}${month}${year}`;

    const prefix = "BT";
    const uniqueId = Math.random().toString(36).substr(2, 5).toUpperCase();
    const orderId = `${prefix}${datePart}${uniqueId}`;

    const newOrder = new orderModel({
      orderId,
      name,
      phone,
      address,
      email,
      description,
      date,
      total,
      listProducts,
      userId,
      paymentStatus,
    });

    const result = await newOrder.save();

    const io = require("../socket").getIO();
    io.emit("newOrder", newOrder);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo đơn hàng",
      error: error.message,
    });
  }
}

async function updateOrderStatus(id, status) {
  const order = await orderModel.findById(id);
  if (!order) throw new Error("Đơn hàng không tồn tại");

  const validStatuses = [
    "Chờ xác nhận",
    "Đang xử lý",
    "Đang vận chuyển",
    "Giao thành công",
    "Đã hủy",
  ];

  const currentStatusIndex = validStatuses.indexOf(order.status);
  const newStatusIndex = validStatuses.indexOf(status);

  if (newStatusIndex <= currentStatusIndex) {
    throw new Error(
      "Không thể chuyển trạng thái đơn hàng về trạng thái trước đó."
    );
  }

  // Cập nhật trạng thái và thời gian cập nhật
  order.status = status;
  order.updatedAt = Date.now();

  return await order.save();
}

// Chỉnh sửa thông tin đơn hàng
async function updateOrderInfo(id, updateData) {
  try {
    const order = await orderModel.findById(id);
    if (!order) throw new Error("Đơn hàng không tồn tại");

    Object.assign(order, updateData);
    order.updatedAt = Date.now();

    return await order.save();
  } catch (error) {
    throw new Error("Lỗi khi chỉnh sửa thông tin đơn hàng: " + error.message);
  }
}

// Hủy đơn hàng
async function cancelOrder(id) {
  try {
    const order = await orderModel.findById(id);
    if (!order) throw new Error("Đơn hàng không tồn tại");

    // Không cho phép xóa nếu đơn hàng đang vận chuyển
    if (order.status === "Đang vận chuyển") {
      throw new Error("Đơn hàng đang được vận chuyển không thể xóa");
    }

    // Xử lý logic xóa đơn hàng trong các trường hợp hợp lệ
    await orderModel.deleteOne({ _id: id });
    return { message: "Đơn hàng đã được xóa thành công" };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function getOrdersByUserId(userId) {
  try {
    const orders = await orderModel.find({ userId: userId });
    if (!orders || orders.length === 0) {
      throw new Error("Không tìm thấy đơn hàng cho người dùng này");
    }
    return orders;
  } catch (error) {
    console.log("Lỗi", error);
    throw error;
  }
}

// async function getOrdersByUserId(userId) {
//   try {
//     // Kiểm tra xem userId có phải là Firebase UID hay không
//     let orders;

//     // Firebase UID thường là một chuỗi dài (24 ký tự hoặc hơn)
//     // MongoDB ObjectId là một chuỗi 24 ký tự
//     if (userId.length === 28) {
//       // Đây là _id MongoDB truyền thống
//       orders = await orderModel.find({ userId: userId });
//     } else {
//       // Đây là Firebase UID (uid từ Google login)
//       orders = await orderModel.find({ firebaseUid: userId });
//     }

//     if (!orders || orders.length === 0) {
//       throw new Error("Không tìm thấy đơn hàng cho người dùng này");
//     }

//     return orders;
//   } catch (error) {
//     console.log("Lỗi khi lấy đơn hàng:", error);
//     throw error;
//   }
// }

async function getOrderById(id) {
  try {
    const order = await orderModel.findById(id);
    if (!order) {
      throw new Error("Lấy chi tiết đơn hàng không thành công");
    }
    return order;
  } catch (error) {
    console.log("Lỗi", error);
    throw error;
  }
}
async function getOrderStatusByProduct(req, res) {
  try {
    const { userId, productId } = req.params;

    // Tìm đơn hàng thành công có chứa sản phẩm với productId
    const order = await orderModel.findOne({
      userId,
      status: "Giao thành công",
      "listProducts._id": productId, // Lọc theo productId
    });

    if (!order) {
      return res
        .status(404)
        .json({
          message: "Không tìm thấy sản phẩm trong đơn hàng thành công.",
        });
    }

    const product = order.listProducts.find(
      (item) => item._id.toString() === productId
    );
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại." });
    }

    const reviewStatus = product.reviewStatus || "Chưa đánh giá";

    return res.status(200).json({
      orderId: order.orderId,
      product: {
        productId: productId,
        status: reviewStatus, // Trả trạng thái đánh giá
      },
    });
  } catch (error) {
    console.log("Lỗi khi lấy trạng thái sản phẩm trong đơn hàng:", error);
    return res.status(500).json({ message: error.message });
  }
}

async function handleReview() {
  try {
    const response = await fetch(`${URL_API}/review/${productId}`, {
      method: "PUT",
    });

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message);
      return;
    }

    setOrderStatus("Đã đánh giá");
    toast.success("Đánh giá đã được ghi nhận.");
  } catch (error) {
    console.error("Lỗi khi gửi đánh giá:", error);
    toast.error("Không thể gửi đánh giá. Vui lòng thử lại.");
  }
}
