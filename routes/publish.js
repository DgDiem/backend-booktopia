var express = require("express");
var router = express.Router();
const publishController = require("../controller/publish.controller");
const productController = require("../controller/product.controller");
const checktoken = require("../helper/checktoken");
const authen = require("../middleware/authen");

router.get("/", async (req, res) => {
  try {
    const publish = await publishController.gettAll();
    // console.log("publish:", publish);
    return res.status(200).json(publish);
  } catch (error) {
    console.log("Load danh muc không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/publishId/:publish", async (req, res, next) => {
  try {
    const publish = req.params.publish;
    const products = await publishController.getBypublish(publish);

    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

// them danh mục mơi

router.post("/",[authen([1])], async (req, res) => {
  try {
    const body = req.body;
    const result = await publishController.insert(body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Thêm danh mục không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy đượccái id mà người dùng gửi lên
    const pro = await publishController.getById(id);
    // return pro
    return res.status(200).json(pro);
  } catch (error) {
    console.log("lỗi lay chi tiet sp", error);
    return res.status(500).json({ mess: error });
  }
});

//routing cập nhật sản phẩm theo id
router.put("/:id",[authen([1])], async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const cateUpdate = await publishController.updateById(id, body);
    return res.status(200).json({ cateUpdate: cateUpdate });
  } catch (error) {
    console.log("lỗi update danh mục ", error);
    return res.status(500).json({ mess: error });
  }
});

//routing xóa danh mục theo id

router.delete("/delete/:id",[authen([1])], async (req, res) => {
  try {
    const { id } = req.params; // lấy đượccái id mà người dùng gửi lên
    const cateDel = await publishController.deleteCate(id);
    console.log("Xóa danh mục thành công");
    return res.status(200).json(cateDel);
  } catch (error) {
    console.log("lỗi xóa danh mục theo id", error);
    return res.status(500).json({ mess: error });
  }
});

// router.get('/name/:publishName', async (req, res, next) => {
//   try {
//     const publishName = req.params.publishName;

//     // Lấy ID của danh mục từ tên danh mục
//     const publish = await publishController.getpublishByName(publishName);
//     if (!publish) {
//       return res.status(404).json({ message: 'Không tìm thấy danh mục' });
//     }

//     // Gọi hàm getBypublish với ID của danh mục
//     const products = await publishController.getBypublish(publish._id);

//     return res.status(200).json({ [publishName]: products });
//   } catch (error) {
//     console.log('Load sản phẩm không thành công', error);
//     res.status(500).json({ message: 'Load sản phẩm không thành công', error });
//   }
// });

module.exports = router;
