const voucherModel = require("../model/voucher.model");

module.exports = {
  getAll,
  insertVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucher,
  deactivateVoucher,
  getVoucherById,
  updateStatusById,
  getAllAdmin
};

// danh sách voucher
async function getAll() {
  try {
    const res = await voucherModel.find({isActive: true});
    return res;
  } catch (error) {
    console.log("Lỗi lấy danh sách voucher", error);
    throw error;
  }
}

async function getAllAdmin() {
  try {
    const res = await voucherModel.find();
    return res;
  } catch (error) {
    console.log("Lỗi lấy danh sách voucher", error);
    throw error;
  }
}

// thêm voucher
async function insertVoucher(body) {
  try {
    const {
      code,
      type,
      minimumOrderValue,
      effectiveDate,
      expirationDate,
      discountValue,
    } = body;
    const voucher = new voucherModel({
      code,
      type,
      minimumOrderValue,
      effectiveDate,
      expirationDate,
      discountValue,
    });
    const res = await voucher.save();
    return res;
  } catch (error) {
    console.error("Không thể thêm mới voucher", error);
    throw error;
  }
}
// sửa voucher
async function updateVoucher(id, body) {
  try {
    const voucher = await voucherModel.findById(id);
    if (!voucher) {
      throw new Error("Không tìm thấy voucher");
    }
    const {
      code,
      type,
      minimumOrderValue,
      effectiveDate,
      expirationDate,
      discountValue,
    } = body;
    const res = await voucherModel.findByIdAndUpdate(id, {
      code,
      type,
      minimumOrderValue,
      effectiveDate,
      expirationDate,
      discountValue,
    });
    return res;
  } catch (error) {
    console.log("Không thể update voucher", error);
    throw error;
  }
}
// xóa voucher
async function deleteVoucher(id) {
  try {
    const result = await voucherModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log("Lỗi xóa danh mục", error);
    throw error;
  }
}
// áp dụng voucher
async function updateStatusById(id, isActive) {
  try {
    const cate = await voucherModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy danh mục");
    }
    const result = await voucherModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true } 
    );
    return result;
  } catch (error) {
    throw error;
  }
}

async function applyVoucher(body) {
    try {
      const { code, orderValue } = body; 
      const voucher = await voucherModel.findOne({ code, isActive: true });
      
      if (!voucher) {
        return { status: 400, message: "Voucher không hợp lệ hoặc không còn hiệu lực." };
      }
      
      // Kiểm tra gia trị đơn hàng
      if (orderValue < voucher.minimumOrderValue) {
        return {
          status: 400,
          message: `Đơn hàng tối thiểu để áp dụng voucher là ${voucher.minimumOrderValue}.`,
        };
      }
      
      // Kiểm tra ngày hiệu lực
      const currentDate = new Date();
      if (currentDate < voucher.effectiveDate || currentDate > voucher.expirationDate) {
        return { status: 400, message: "Voucher đã hết hạn." };
      }
      
      // Tính toán giảm giá
      let discount = 0;
      if (voucher.type === "Discount") {
        discount = (voucher.discountValue / 100) * orderValue; 
      } else if (voucher.type === "Shipping") {
        discount = voucher.discountValue; 
      }
    return {
      status: 200,
      data: {
        message: "Voucher áp dụng thành công!",
        voucher: {
          code: voucher.code,
          type: voucher.type,
          discountValue: discount,
        },
      },
    };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

// ngưng hoạt động voucher
async function deactivateVoucher(id) {
  try {
    const voucher = await voucherModel.findById(id);
    if (!voucher) {
      throw new Error("Không tìm thấy voucher với ID đã cho.");
    }
    voucher.isActive = false;
    await voucher.save();

    return { message: "Voucher đã được ngưng hoạt động thành công.", voucher };
  } catch (error) {
    console.error("Lỗi trong deactivateVoucher:", error);
    throw error;
  }
  }

  async function getVoucherById(id) {
    try {
      const voucher = await voucherModel.findById(id);
      return voucher;
    } catch (error) {
      console.log("Lỗi lấy chi tiết voucher", error);
      throw error;
    }
  }
