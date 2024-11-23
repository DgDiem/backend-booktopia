var express = require("express");
var router = express.Router();
const authorController = require("../controller/author.controller");
const productController = require("../controller/product.controller");
const checktoken = require("../helper/checktoken");
const authen = require("../middleware/authen");

router.get("/", async (req, res) => {
  try {
    const author = await authorController.gettAll();
    // console.log("author:", author);
    return res.status(200).json(author);
  } catch (error) {
    console.log("Load danh muc không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/authorId/:author", async (req, res, next) => {
  try {
    const author = req.params.author;
    const products = await authorController.getByauthor(author);

    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

// them danh mục mơi

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const result = await authorController.insert(body);
    return res.status(200).json(result);
  } catch (error) {
    console.log("Thêm danh mục không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy đượccái id mà người dùng gửi lên
    const pro = await authorController.getById(id);
    // return pro
    return res.status(200).json(pro);
  } catch (error) {
    console.log("lỗi lay chi tiet sp", error);
    return res.status(500).json({ mess: error });
  }
});

//routing cập nhật sản phẩm theo id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const cateUpdate = await authorController.updateById(id, body);
    return res.status(200).json({ cateUpdate: cateUpdate });
  } catch (error) {
    console.log("lỗi update danh mục ", error);
    return res.status(500).json({ mess: error });
  }
});

//routing xóa danh mục theo id

router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy đượccái id mà người dùng gửi lên
    const cateDel = await authorController.deleteCate(id);
    console.log("Xóa danh mục thành công");
    return res.status(200).json(cateDel);
  } catch (error) {
    console.log("lỗi xóa danh mục theo id", error);
    return res.status(500).json({ mess: error });
  }
});

// router.get('/name/:authorName', async (req, res, next) => {
//   try {
//     const authorName = req.params.authorName;

//     // Lấy ID của danh mục từ tên danh mục
//     const author = await authorController.getauthorByName(authorName);
//     if (!author) {
//       return res.status(404).json({ message: 'Không tìm thấy danh mục' });
//     }

//     // Gọi hàm getByauthor với ID của danh mục
//     const products = await authorController.getByauthor(author._id);

//     return res.status(200).json({ [authorName]: products });
//   } catch (error) {
//     console.log('Load sản phẩm không thành công', error);
//     res.status(500).json({ message: 'Load sản phẩm không thành công', error });
//   }
// });

module.exports = router;
