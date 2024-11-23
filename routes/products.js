var express = require("express");
var router = express.Router();
const productController = require("../controller/product.controller");
const multer = require("multer");
const checktoken = require("../helper/checktoken");
const upload = require("../helper/upload");
const path = require("path");
const productModel = require("../model/product.model");
const authen = require("../middleware/authen");

/*Phân trang*/

// Route để lấy tất cả sản phẩm với phân trang và sắp xếp
router.get("/paginated/products", async (req, res) => {
  try {
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || "new";

    const paginatedProducts =
      await productController.getPaginatedAndSortedProducts(
        pageNumber,
        limit,
        sortBy
      );

    return res.status(200).json(paginatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sản phẩm", error);
    res.status(500).json({ msg: "Xin lỗi, đã xảy ra lỗi" });
  }
});

/*Phân trang*/
router.get("/paginated/categoryId/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || "new";

    const paginatedProducts =
      await productController.getPaginatedProductsByCategorySorted(
        category,
        pageNumber,
        limit,
        sortBy
      );

    return res.status(200).json(paginatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo danh mục", error);
    res.status(500).json({ msg: "Xin lỗi, đã xảy ra lỗi" });
  }
});

/*Phân trang*/
router.get("/paginated/authorId/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || "new";

    const paginatedProducts =
      await productController.getPaginatedProductsByAuthorSorted(
        author,
        pageNumber,
        limit,
        sortBy
      );

    return res.status(200).json(paginatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo tác giả", error);
    res.status(500).json({ msg: "Xin lỗi, đã xảy ra lỗi" });
  }
});
/*Phân trang*/
router.get("/paginated/publisherId/:publisher", async (req, res) => {
  try {
    const publisher = req.params.publisher;
    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || "new";

    const paginatedProducts =
      await productController.getPaginatedProductsByPublisherSorted(
        publisher,
        pageNumber,
        limit,
        sortBy
      );

    return res.status(200).json(paginatedProducts);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm theo nhà xuất bản", error);
    res.status(500).json({ msg: "Xin lỗi, đã xảy ra lỗi" });
  }
});

/*Phân trang*/
router.get("/products/total", async (req, res) => {
  try {
    // Đếm tổng sản phẩm mà không cần điều kiện lọc
    const totalProducts = await productModel.countDocuments({});
    res.status(200).json({ total: totalProducts });
  } catch (error) {
    console.error("Lỗi khi lấy tổng số sản phẩm:", error);
    res.status(500).json({ msg: "Đã xảy ra lỗi, vui lòng thử lại." });
  }
});

//cập nhật lượt view từng sản phẩm
router.put("/:id/views", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { $inc: { view: 1 } },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json({
      message: "Lượt xem đã được cập nhật!",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mess: error.message });
  }
});

// Thêm sản phẩm
// Thêm sản phẩm phải có Formdata ,multipart/form-data, và input file
// Thêm hình : mỗi hình một input có name là image1234 => Hình sẽ được lưu trong public/images của backend
router.post(
  "/",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  [authen([1])],
  async (req, res) => {
    try {
      const body = req.body;

      // Kiểm tra nếu image1 có tồn tại
      if (!req.files["image1"]?.length) {
        return res.status(400).json({ mess: "Bắt buộc phải có hình ảnh 1" });
      }

      body.image1 = req.files["image1"][0].filename;
      body.image2 = req.files["image2"]?.[0]?.filename || null;
      body.image3 = req.files["image3"]?.[0]?.filename || null;
      body.image4 = req.files["image4"]?.[0]?.filename || null;

      const result = await productController.insert(body);
      return res.status(200).json(result);
    } catch (error) {
      console.log("Thêm sản phẩm không thành công", error);
      res.status(500).json({ mess: error.message });
    }
  }
);

//Router Hiển thị tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const product = await productController.gettAll();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm mới nhất
router.get("/new", async (req, res) => {
  try {
    const product = await productController.getNew();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm nhiều lượt xem
router.get("/view", async (req, res) => {
  try {
    const product = await productController.getProView();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router Sửa sản phẩm
router.put(
  "/:id",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  [authen([1])],
  async (req, res) => {
    try {
      const { id } = req.params;
      const body = req.body;

      // Kiểm tra xem có tệp tin ảnh được gửi lên hay không
      if (req.files) {
        if (req.files["image1"]) body.image1 = req.files["image1"][0].filename;
        if (req.files["image2"]) body.image2 = req.files["image2"][0].filename;
        if (req.files["image3"]) body.image3 = req.files["image3"][0].filename;
        if (req.files["image4"]) body.image4 = req.files["image4"][0].filename;
      }

      // Cập nhật sản phẩm chỉ với các trường được gửi lên
      const proUpdate = await productController.updateById(id, body);
      return res.status(200).json({ ProductUpdate: proUpdate });
    } catch (error) {
      console.log("Lỗi update sản phẩm theo id", error);
      return res.status(500).json({ mess: error.message });
    }
  }
);

//Router xóa sản phẩm

router.delete("/:id", [authen([1])], async (req, res) => {
  try {
    const { id } = req.params; // lấy đượccái id mà người dùng gửi lên
    const proDel = await productController.remove(id);
    console.log("Xóa sp thành công");
    return res.status(200).json({ ProducDelete: proDel });
  } catch (error) {
    console.log("lỗi xóa sp theo id", error);
    return res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm hot
router.get("/hot", async (req, res) => {
  try {
    const product = await productController.getHot();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.put("/:id/hot", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productModel.findByIdAndUpdate(
      id,
      { $inc: { hot: 1 } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi cập nhật hot:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
  }
});

router.put("/:id/quantity", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productModel.findByIdAndUpdate(
      id,
      { $inc: { quantity: -1 } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi cập nhật kho:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
  }
});
router.put("/:id/sale", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await productModel.findByIdAndUpdate(
      id,
      { $inc: { sale: 1 } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi cập nhật hot:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
  }
});

//Router hiển thị sản phẩm mới nhất bên trang sản phẩm
router.get("/newpro", async (req, res) => {
  try {
    const product = await productController.getNewProduct();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//sản phẩm mới theo danh mục bên trang sản phẩm
router.get("/categoryId/:id/newpro", async (req, res) => {
  try {
    const categoryId = req.params.id; // Lấy id từ tham số URL
    const products = await productController.getNewProductCategory(categoryId);
    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error.message });
  }
});

//sản phẩm giá tăng dần theo danh mục bên trang sản phẩm
//http://localhost:3000/products/sort/asc
router.get("/categoryId/:id/sort/asc", async (req, res) => {
  try {
    const categoryId = req.params.id; // Lấy id từ tham số URL
    const product = await productController.getAscendingCategory(categoryId);
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//sản phẩm giá giảm dần theo danh mục bên trang sản phẩm
//http://localhost:3000/products/sort/desc
router.get("/categoryId/:id/sort/desc", async (req, res) => {
  try {
    const categoryId = req.params.id; // Lấy id từ tham số URL
    const product = await productController.getDecreaseCategory(categoryId);
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//sản phẩm mới theo tác giả
router.get("/authorId/:id/newpro", async (req, res) => {
  try {
    const authorId = req.params.id; // Lấy id từ tham số URL
    const products = await productController.getNewProductAuthor(authorId);
    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error.message });
  }
});
//sản phẩm giá tăng dần theo tacs gia bên trang sản phẩm
//http://localhost:3000/products/sort/asc
router.get("/authorId/:id/sort/asc", async (req, res) => {
  try {
    const authorId = req.params.id; // Lấy id từ tham số URL
    const product = await productController.getAscendingAuthor(authorId);
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//sản phẩm giá giảm dần theo tacs gia bên trang sản phẩm
//http://localhost:3000/products/sort/desc
router.get("/authorId/:id/sort/desc", async (req, res) => {
  try {
    const authorId = req.params.id; // Lấy id từ tham số URL
    const product = await productController.getDecreaseAuthor(authorId);
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//sản phẩm mới theo tác giả
router.get("/publishId/:id/newpro", async (req, res) => {
  try {
    const publishId = req.params.id; // Lấy id từ tham số URL
    const products = await productController.getNewProductPublish(publishId);
    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error.message });
  }
});
//sản phẩm giá tăng dần theo tacs gia bên trang sản phẩm
//http://localhost:3000/products/sort/asc
router.get("/publishId/:id/sort/asc", async (req, res) => {
  try {
    const publishId = req.params.id; // Lấy id từ tham số URL
    const product = await productController.getAscendingPublish(publishId);
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//sản phẩm giá giảm dần theo tacs gia bên trang sản phẩm
//http://localhost:3000/products/sort/desc
router.get("/publishId/:id/sort/desc", async (req, res) => {
  try {
    const publishId = req.params.id; // Lấy id từ tham số URL
    const product = await productController.getDecreasePublish(publishId);
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

/**************************************************************************************************************************************************/

//Router chi tiết sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy được cái id mà người dùng gửi lên
    const pro = await productController.getById(id);
    // return pro
    return res.status(200).json(pro);
  } catch (error) {
    console.log("lỗi lay chi tiet sp", error);
    return res.status(500).json({ mess: error });
  }
});

//Router hiển thị sản phẩm liên quan
router.get("/related/:id/related", async (req, res) => {
  try {
    const { id } = req.params; // Lấy id của sản phẩm từ URL
    console.log("Product ID:", id); // Kiểm tra xem id đã được lấy đúng chưa
    const relatedProducts = await productController.getRelated(id);
    console.log("Related Products:", relatedProducts); // Kiểm tra kết quả trả về từ controller
    return res.status(200).json(relatedProducts);
  } catch (error) {
    console.log("Lỗi lấy sản phẩm liên quan theo danh mục", error);
    return res.status(500).json({ message: error.message });
  }
});

//Router tìm kiếm sản phẩm
router.get("/search/:name", async (req, res) => {
  try {
    const name = req.params.name; // Lấy tên sản phẩm từ route param
    const pro = await productController.search(name); // Gọi hàm search với tên sản phẩm
    return res.status(200).json(pro);
  } catch (error) {
    console.log("Lỗi tìm kiếm sản phẩm", error);
    return res.status(500).json({ mess: error });
  }
});

//Router lọc sản phẩm tăng dần
//http://localhost:3000/products/sort/asc
router.get("/sort/asc", async (req, res) => {
  try {
    const product = await productController.getAscending();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router lọc sản phẩm giảm dần
//http://localhost:3000/products/sort/desc
router.get("/sort/desc", async (req, res) => {
  try {
    const product = await productController.getDecrease();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Router sản phẩm sale
//http://localhost:3000/products/sort/sale
// Sản phẩm sale dựa vào giá, nếu sản phẩm nào có price 2 thì mới show
router.get("/sort/sale", async (req, res) => {
  try {
    const products = await productController.getSale();
    return res.status(200).json({ ProductsSale: products });
  } catch (error) {
    console.log("Load sản phẩm sale không thành công", error);
    res.status(500).json(error);
  }
});

//Show sản phẩm theo categoryID
router.get("/categoryId/:category", async (req, res, next) => {
  try {
    const category = req.params.category;
    const products = await productController.getByCategory(category);

    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Show sản phẩm theo publishId
router.get("/publishId/:publish", async (req, res, next) => {
  try {
    const publish = req.params.publish;
    const products = await productController.getByPublish(publish);

    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

//Show sản phẩm theo authorId
router.get("/authorId/:author", async (req, res, next) => {
  try {
    const author = req.params.author;
    const products = await productController.getByAuthor(author);

    return res.status(200).json(products);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});
module.exports = router;
