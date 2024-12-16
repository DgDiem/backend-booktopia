const categoryModel = require("../model/categories.model");
const productModel = require("../model/product.model");
module.exports = {
  gettAll,
  insert,
  updateById,
  getByCategory,
  getCategoryByName,
  deleteCate,
  getCategoryById,
  updateStatusById,
  getAllAdmin
};

// Show tất cả danh mục
async function gettAll() {
  try {
    const result = await categoryModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}
async function getAllAdmin() {
  try {
    const result = await categoryModel.find({ isActive: true });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

// lấy sản phẩm theo danh mục
async function getByCategory(category) {
  try {
    const productsCategory = await productModel.find({
      "category.categoryId": category,
    });
    return productsCategory;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm theo ID danh mục", error);
    throw error;
  }
}

async function getCategoryByName(categoryName) {
  try {
    const category = await categoryModel.findOne({ name: categoryName });
    return category;
  } catch (error) {
    throw error;
  }
}

// thêm danh mục

async function insert(body) {
  try {
    const { name, description } = body;
    console.log("Category Name:", name);
    console.log("Category Mô tả:", description);

    const cateNew = new categoryModel({ name, description });
    const result = await cateNew.save();
    return result;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
}

// cập nhật danh mục theo id

async function updateById(id, body) {
  try {
    const cate = await categoryModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy danh mục");
    }
    const { name, description } = body;
    const result = await categoryModel.findByIdAndUpdate(id, {
      name,
      description,
    });
    return result;
  } catch (error) {
    console.log("lỗi update", error);
    throw error;
  }
}
// update trạng thái isactive của category
async function updateStatusById(id, isActive) {
  try {
    const cate = await categoryModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy danh mục");
    }
    const result = await categoryModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

// xóa danh mục theo id
async function deleteCate(id) {
  try {
    // kiểm tra xem trong danh mục có sản phẩm nào không
    const pros = await productModel.find({ "category.categoryId": id });
    if (pros.length > 0) {
      return { mess: "Danh mục có sản phẩm không thể xóa" };
    } else {
      const result = await categoryModel.findByIdAndDelete(id);
      return result;
    }
  } catch (error) {
    console.log("LỖI XÓA DANH MỤC THEO ID", error);
    throw error;
  }
}

// chi tiết category

async function getCategoryById(id) {
  try {
    const proId = await categoryModel.findById(id);
    return proId;
  } catch (error) {
    console.log("LỖI LẤY CHI TIẾT SP", error);
    throw error;
  }
}
