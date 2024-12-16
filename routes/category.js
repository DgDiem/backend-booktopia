var express = require("express");
var router = express.Router();
const categoryController = require("../controller/categories.controller");
const productController = require("../controller/product.controller");
const checktoken = require("../helper/checktoken");
const authen = require("../middleware/authen");

//Show danh mục

router.get("/", async (req, res) => {
  try {
    const category = await categoryController.gettAll();
    // console.log("Category:", category);
    return res.status(200).json(category);
  } catch (error) {
    console.log("Load danh muc không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/admin", async (req, res) => {
  try {
    const category = await categoryController.getAllAdmin();
    return res.status(200).json(category);
  } catch (error) {
    console.log("Load danh muc không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Show danh mục theo ID
router.get("/categoryId/:category", async (req, res, next) => {
  try {
    const category = req.params.category;
    const products = await categoryController.getByCategory(category);

    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

// Thêm danh mục mơi
router.post("/",  async (req, res) => {
  try {
    const body = req.body;
    const result = await categoryController.insert(body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Thêm danh mục không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Sửa danh mục theo id
router.put("/:id",  async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const cateUpdate = await categoryController.updateById(id, body);
    return res.status(200).json({ cateUpdate: cateUpdate });
  } catch (error) {
    console.log("lỗi update danh mục ", error);
    return res.status(500).json({ mess: error });
  }
});

router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const updatedCategory = await categoryController.updateStatusById(id, isActive);
    res.status(200).json({ message: "Cập nhật trạng thái thành công", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
  }
});
// chi tiết category

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy được cái id mà người dùng gửi lên
    const pro = await categoryController.getCategoryById(id);
    // return pro
    return res.status(200).json(pro);
  } catch (error) {
    console.log("lỗi lay chi tiet sp", error);
    return res.status(500).json({ mess: error });
  }
});

//Xóa danh mục theo id
router.delete("/delete/:id",async (req, res) => {
  try {
    const { id } = req.params; // lấy được cái id mà người dùng gửi lên
    const cateDel = await categoryController.deleteCate(id);
    console.log("Xóa danh mục thành công");
    return res.status(200).json(cateDel);
  } catch (error) {
    console.log("lỗi xóa danh mục theo id", error);
    return res.status(500).json({ mess: error });
  }
});

// router.get('/name/:categoryName', async (req, res, next) => {
//   try {
//     const categoryName = req.params.categoryName;

//     // Lấy ID của danh mục từ tên danh mục
//     const category = await categoryController.getCategoryByName(categoryName);
//     if (!category) {
//       return res.status(404).json({ message: 'Không tìm thấy danh mục' });
//     }

//     // Gọi hàm getByCategory với ID của danh mục
//     const products = await categoryController.getByCategory(category._id);

//     return res.status(200).json({ [categoryName]: products });
//   } catch (error) {
//     console.log('Load sản phẩm không thành công', error);
//     res.status(500).json({ message: 'Load sản phẩm không thành công', error });
//   }
// });

module.exports = router;
