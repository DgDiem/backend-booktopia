var express = require("express");
var router = express.Router();
const voucherController = require("../controller/voucher.controller");
const authen = require("../middleware/authen");

// danh sách voucher
router.get("/", async (req, res) => {
  try {
    const vouchers = await voucherController.getAll();
    return res.status(200).json(vouchers);
  } catch (error) {
    console.log("Load danh sách voucher không thành công", error);
    res.status(500).json({ mess: error });
  }
});

// Thêm danh mục mơi
router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await voucherController.insertVoucher(body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Thêm voucher không thành công", error);
    res.status(500).json({ mess: error });
  }
});

// update voucher
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const voucherUpdate = await voucherController.updateVoucher(id, body);
    return res.status(200).json(voucherUpdate);
  } catch (error) {
    console.log("Lỗi cập nhật voucher", error);
    return res.status(500).json({ mess: error });
  }
});

// xóa voucher
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await voucherController.deleteVoucher(id);
    console.log("Xóa danh mục thành công");
    return res.status(200).json(voucher);
  } catch (error) {
    console.log("lỗi xóa danh mục theo id", error);
    return res.status(500).json({ mess: error });
  }
});

router.post("/apply", async (req, res) => {
  try {
    const body = req.body;
    const result = await voucherController.applyVoucher(body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Áp dụng voucher không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.put("/deactivate/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await voucherController.deactivateVoucher(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Ngưng hoạt động voucher không thành công", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const voucher = await voucherController.getVoucherById(id);
    return res.status(200).json(voucher);
  } catch (error) {
    console.log("lỗi lay chi tiet voucher", error);
    return res.status(500).json({ mess: error });
  }
});
module.exports = router;
