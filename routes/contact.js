var express = require("express");
var router = express.Router();
const contactController = require("../controller/contact.controller");

router.post("/api/contact", async (req, res) => {
  try {
    const body = req.body;

    const result = await contactController.createContact(body);
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Có lỗi xảy ra khi gửi form", error: error.message });
  }
});

router.get("/api/contacts", async (req, res) => {
  try {
    const result = await contactController.getContacts();
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi lấy thông tin liên hệ",
      error: error.message,
    });
  }
});

router.patch("/api/contact/:id/status", async (req, res) => {
  try {
    const result = await contactController.updateContactStatus(req, res);
    return result;
  } catch (error) {
    res.status(500).json({
      message: "Có lỗi xảy ra khi cập nhật trạng thái",
      error: error.message,
    });
  }
});

router.delete("/api/contact/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contactController.deleteContact(id);
    return res.status(200).json({
      message: "Xóa liên hệ thành công",
      contact: result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
module.exports = router;
