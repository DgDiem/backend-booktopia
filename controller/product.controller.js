const productModel = require("../model/product.model");
const categoryModel = require("../model/categories.model");
const publishModel = require("../model/publish.model");
const authorModel = require("../model/author.model");
const mongoose = require("mongoose"); // Thêm dòng này ở đầu tệp

module.exports = {
  insert,
  gettAll,
  updateById,
  remove,
  getLimited,
  getNew,
  getNewProduct,
  getProView,
  getById,
  search,
  getHot,
  getRelated,
  getNewProductCategory,
  getDecreaseCategory,
  getAscendingCategory,
  getNewProductAuthor,
  getDecrease,
  getAscending,
  getDecreaseAuthor,
  getAscendingAuthor,
  getDecreasePublish,
  getAscendingPublish,
  getNewProductPublish,
  getSale,
  getByCategory,
  getByPublish,
  getByAuthor,
  getPaginatedProductsByPublisherSorted,
  getPaginatedProductsByAuthorSorted,
  getPaginatedProductsByCategorySorted,
  getPaginatedAndSortedProducts,
  updateStatusById,
  gettAllAdmin,
  getStock,
};

/*Phân trang*/
async function getPaginatedAndSortedProducts(pageNumber, limit, sortBy) {
  try {
    const totalProducts = await productModel.countDocuments().exec();

    // Thiết lập tùy chọn sắp xếp
    let sortOption = {};
    if (sortBy === "new") {
      sortOption = { _id: -1 }; // Sắp xếp sản phẩm mới nhất trước
    } else if (sortBy === "priceAsc") {
      sortOption = { price2: 1 }; // Sắp xếp theo giá tăng dần
    } else if (sortBy === "priceDesc") {
      sortOption = { price2: -1 }; // Sắp xếp theo giá giảm dần
    }

    // Lấy sản phẩm với phân trang và sắp xếp
    const products = await productModel
      .find()
      .sort(sortOption)
      .skip(pageNumber * limit)
      .limit(limit)
      .exec();

    // Thêm thông tin phân trang
    const paginationInfo = {};
    if (pageNumber > 0) {
      paginationInfo.previous = { pageNumber: pageNumber - 1, limit };
    }
    if ((pageNumber + 1) * limit < totalProducts) {
      paginationInfo.next = { pageNumber: pageNumber + 1, limit };
    }

    return { totalProducts, products, pagination: paginationInfo };
  } catch (error) {
    console.error("Lỗi khi phân trang và sắp xếp sản phẩm", error);
    throw error;
  }
}

/*Phân trang*/
async function getPaginatedProductsByCategorySorted(
  category,
  pageNumber,
  limit,
  sortBy
) {
  try {
    // Kiểm tra category xem có hợp lệ không
    const categoryObjectId = mongoose.Types.ObjectId.isValid(category)
      ? new mongoose.Types.ObjectId(category)
      : null;

    // Nếu category không hợp lệ, trả về lỗi
    if (!categoryObjectId) {
      throw new Error("Category ID không hợp lệ");
    }

    const totalProducts = await productModel.countDocuments({
      "category.categoryId": categoryObjectId,
    });

    // Sắp xếp theo yêu cầu
    let sortOption = {};
    if (sortBy === "new") {
      sortOption = { _id: -1 }; // Sắp xếp sản phẩm mới nhất trước
    } else if (sortBy === "priceAsc") {
      sortOption = { price2: 1 }; // Sắp xếp theo giá tăng dần
    } else if (sortBy === "priceDesc") {
      sortOption = { price2: -1 }; // Sắp xếp theo giá giảm dần
    }

    const result = await productModel
      .find({ "category.categoryId": categoryObjectId })
      .sort(sortOption)
      .skip(pageNumber * limit)
      .limit(limit)
      .exec();

    // Thêm thông tin phân trang
    const paginationInfo = {
      totalProducts,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limit),
      products: result,
    };

    if (pageNumber > 0) {
      paginationInfo.previous = { pageNumber: pageNumber - 1, limit: limit };
    }
    if ((pageNumber + 1) * limit < totalProducts) {
      paginationInfo.next = { pageNumber: pageNumber + 1, limit: limit };
    }

    return paginationInfo;
  } catch (error) {
    console.log("Lỗi khi phân trang sản phẩm theo danh mục", error);
    throw error;
  }
}

/*Phân trang*/
async function getPaginatedProductsByAuthorSorted(
  author,
  pageNumber,
  limit,
  sortBy
) {
  try {
    const totalProducts = await productModel.countDocuments({
      "author.authorId": new mongoose.Types.ObjectId(author),
    });

    // Sắp xếp theo yêu cầu
    let sortOption = {};
    if (sortBy === "new") {
      sortOption = { _id: -1 }; // Sắp xếp sản phẩm mới nhất trước
    } else if (sortBy === "priceAsc") {
      sortOption = { price2: 1 }; // Sắp xếp theo giá tăng dần
    } else if (sortBy === "priceDesc") {
      sortOption = { price2: -1 }; // Sắp xếp theo giá giảm dần
    }

    const result = await productModel
      .find({ "author.authorId": new mongoose.Types.ObjectId(author) })
      .sort(sortOption)
      .skip(pageNumber * limit)
      .limit(limit)
      .exec();

    // Thêm thông tin phân trang
    if (pageNumber > 0) {
      result.previous = { pageNumber: pageNumber - 1, limit: limit };
    }
    if ((pageNumber + 1) * limit < totalProducts) {
      result.next = { pageNumber: pageNumber + 1, limit: limit };
    }

    return { totalProducts, products: result };
  } catch (error) {
    console.log("Lỗi khi phân trang sản phẩm theo tác giả", error);
    throw error;
  }
}

/*Phân trang*/
async function getPaginatedProductsByPublisherSorted(
  publish,
  pageNumber,
  limit,
  sortBy
) {
  try {
    const totalProducts = await productModel.countDocuments({
      "publish.publishId": new mongoose.Types.ObjectId(publish),
    });

    // Sắp xếp theo yêu cầu
    let sortOption = {};
    if (sortBy === "new") {
      sortOption = { _id: -1 }; // Sắp xếp sản phẩm mới nhất trước
    } else if (sortBy === "priceAsc") {
      sortOption = { price2: 1 }; // Sắp xếp theo giá tăng dần
    } else if (sortBy === "priceDesc") {
      sortOption = { price2: -1 }; // Sắp xếp theo giá giảm dần
    }

    const result = await productModel
      .find({ "publish.publishId": new mongoose.Types.ObjectId(publish) })
      .sort(sortOption)
      .skip(pageNumber * limit)
      .limit(limit)
      .exec();

    // Thêm thông tin phân trang
    if (pageNumber > 0) {
      result.previous = { pageNumber: pageNumber - 1, limit: limit };
    }
    if ((pageNumber + 1) * limit < totalProducts) {
      result.next = { pageNumber: pageNumber + 1, limit: limit };
    }

    return { totalProducts, products: result };
  } catch (error) {
    console.log("Lỗi khi phân trang sản phẩm theo nhà xuất bản", error);
    throw error;
  }
}

// Thêm sản phẩm
async function insert(body) {
  try {
    const {
      name,
      publish,
      author,
      image1,
      image2,
      image3,
      image4,
      price1,
      price2,
      description,
      quantity,
      sale,
      hot,
      view,
      category,
    } = body;

    // Tìm và kiểm tra danh mục
    const categoryFind = await categoryModel.findById(category);
    if (!categoryFind) {
      throw new Error("Không tìm thấy danh mục");
    }
    const publishFind = await publishModel.findById(publish);
    if (!publishFind) {
      throw new Error("Không tìm thấy publish");
    }
    const authorFind = await authorModel.findById(author);
    if (!authorFind) {
      throw new Error("Không tìm thấy publish");
    }
    // Tạo đối tượng sản phẩm mới
    const proNew = new productModel({
      name,
      image1,
      image2,
      image3,
      image4,
      price1,
      price2,
      description,
      quantity,
      sale,
      hot,
      view,
      category: {
        categoryId: categoryFind._id,
        categoryName: categoryFind.name,
      },
      publish: {
        publishId: publishFind._id,
        publishName: publishFind.name,
      },
      author: {
        authorId: authorFind._id,
        authorName: authorFind.name,
      },
    });

    // Lưu vào cơ sở dữ liệu
    const result = await proNew.save();
    return result;
  } catch (error) {
    console.log("Lỗi", error);
    throw error;
  }
}

//Hiển thị tất cả sản phẩm
async function gettAll() {
  try {
    const result = await productModel.find({ isActive: true });
    return result;
  } catch (error) {
    console.log("Thêm sản phẩm không thành công", error);
    throw error;
  }
}
async function gettAllAdmin() {
  try {
    const result = await productModel.find();
    return result;
  } catch (error) {
    console.log("Thêm sản phẩm không thành công", error);
    throw error;
  }
}

// Sửa sản phẩm
async function updateById(id, body) {
  try {
    const pro = await productModel.findById(id);
    if (!pro) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    const {
      name,
      publish,
      author,
      image1,
      image2,
      image3,
      image4,
      price1,
      price2,
      description,
      quantity,
      category,
    } = body;

    // Kiểm tra và lấy thông tin của nhà xuất bản, tác giả và danh mục nếu có
    let cateFind = null;
    let pubFind = null;
    let authFind = null;

    if (category) {
      cateFind = await categoryModel.findById(category);
      if (!cateFind) {
        throw new Error("Không tìm thấy danh mục");
      }
    }

    if (publish) {
      pubFind = await publishModel.findById(publish);
      if (!pubFind) {
        throw new Error("Không tìm thấy nhà xuất bản");
      }
    }

    if (author) {
      authFind = await authorModel.findById(author);
      if (!authFind) {
        throw new Error("Không tìm thấy tác giả");
      }
    }

    const cateUpdate = cateFind
      ? {
          categoryId: cateFind._id,
          categoryName: cateFind.name,
        }
      : pro.category;

    const pubUpdate = pubFind
      ? {
          publishId: pubFind._id,
          publishName: pubFind.name,
        }
      : pro.publish;

    const authUpdate = authFind
      ? {
          authorId: authFind._id,
          authorName: authFind.name,
        }
      : pro.author;

    const result = await productModel.findByIdAndUpdate(
      id,
      {
        name,
        publish: pubUpdate,
        author: authUpdate,
        image1,
        image2,
        image3,
        image4,
        price1,
        price2,
        description,
        quantity,
        category: cateUpdate,
      },
      { new: true }
    );

    return result;
  } catch (error) {
    console.log("Sửa sản phẩm không thành công", error);
    throw error;
  }
}

async function updateStatusById(id, isActive) {
  try {
    const cate = await productModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy sản phẩm");
    }
    const result = await productModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );
    return result;
  } catch (error) {
    throw error;
  }
}

// Xóa sản phẩm
async function remove(id) {
  try {
    const result = await productModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log("Lỗi xóa sản phẩm theo id", error);
    throw error;
  }
}
//hiển thị sản phẩm theo số lượng
async function getLimited(count) {
  try {
    const result = await productModel.find().limit(count);
    return result;
  } catch (error) {
    console.log("Lấy sản phẩm không thành công", error);
    throw error;
  }
}
// Sản phẩm mới nhất bên trang sản phẩm
async function getNewProduct() {
  try {
    const result = await productModel.find().sort({ _id: -1 });
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm mới nhất", error);
    throw error;
  }
}

/************************************************DANH MUC********************************************/

//sản phẩm mới theo danh mục bên trang sản phẩm
async function getNewProductCategory(categoryId) {
  try {
    const result = await productModel
      .find({ "category.categoryId": new mongoose.Types.ObjectId(categoryId) })
      .sort({ _id: -1 });
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm mới nhất", error);
    throw error;
  }
}

//Lọc giá sản phẩm giảm dần theo danh mục bên trang sản phẩm
async function getDecreaseCategory(categoryId) {
  try {
    const result = await productModel
      .find({ "category.categoryId": new mongoose.Types.ObjectId(categoryId) })
      .sort({ price2: -1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

//Lọc giá sản phẩm tăng dần theo danh mục bên trang sản phẩm
async function getAscendingCategory(categoryId) {
  try {
    const result = await productModel
      .find({ "category.categoryId": new mongoose.Types.ObjectId(categoryId) })
      .sort({ price2: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp theo key", error);
    throw error;
  }
}

/*****************************************TÁC GIẢ**************************************************/

//sản phẩm mới theo tác giả bên trang sản phẩm
async function getNewProductAuthor(authorId) {
  try {
    const result = await productModel
      .find({ "author.authorId": new mongoose.Types.ObjectId(authorId) })
      .sort({ _id: -1 });
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm mới nhất", error);
    throw error;
  }
}
//Lọc giá sản phẩm giảm dần theo danh mục bên trang sản phẩm
async function getDecreaseAuthor(authorId) {
  try {
    const result = await productModel
      .find({ "author.authorId": new mongoose.Types.ObjectId(authorId) })
      .sort({ price2: -1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}
//Lọc giá sản phẩm tăng dần theo danh mục bên trang sản phẩm
async function getAscendingAuthor(authorId) {
  try {
    const result = await productModel
      .find({ "author.authorId": new mongoose.Types.ObjectId(authorId) })
      .sort({ price2: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp theo key", error);
    throw error;
  }
}

/*****************************************TÁC GIẢ**************************************************/

//sản phẩm mới theo tác giả bên trang sản phẩm
async function getNewProductPublish(publishId) {
  try {
    const result = await productModel
      .find({ "publish.publishId": new mongoose.Types.ObjectId(publishId) })
      .sort({ _id: -1 });
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm mới nhất", error);
    throw error;
  }
}
//Lọc giá sản phẩm giảm dần theo danh mục bên trang sản phẩm
async function getDecreasePublish(publishId) {
  try {
    const result = await productModel
      .find({ "publish.publishId": new mongoose.Types.ObjectId(publishId) })
      .sort({ price2: -1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}
//Lọc giá sản phẩm tăng dần theo danh mục bên trang sản phẩm
async function getAscendingPublish(publishId) {
  try {
    const result = await productModel
      .find({ "publish.publishId": new mongoose.Types.ObjectId(publishId) })
      .sort({ price2: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp theo key", error);
    throw error;
  }
}

/****************************************************************************************************/

//Sản phẩm nhiều lượt xem
async function getProView() {
  try {
    const result = await productModel
      .find({ view: { $gte: 50 } })
      .sort({ view: -1 })
      .limit(5);
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

// Sản phẩm mới nhất
async function getNew() {
  try {
    const result = await productModel.find().sort({ _id: -1 }).limit(5);
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm mới nhất", error);
    throw error;
  }
}

//Sản phẩm hot
async function getHot() {
  try {
    const result = await productModel.find().sort({ _id: -1 }).limit(5);
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm hot", error);
    throw error;
  }
}

//Sản phẩm tồn kho
async function getStock() {
  try {
    const result = await productModel.find().sort({ quantity: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm hot", error);
    throw error;
  }
}

//Sản phẩm sale
async function getSale() {
  try {
    const result = await productModel.find({
      price2: { $ne: null, $exists: true, $ne: "" },
      $expr: { $lt: ["$price2", "$price1"] },
    });
    return result;
  } catch (error) {
    console.log("Lỗi sản phẩm sale", error);
    throw error;
  }
}

//Chi tiết sản phẩm
async function getById(id) {
  try {
    const proId = await productModel.findById(id);
    return proId;
  } catch (error) {
    console.log("LỖI LAAYS CHI TIẾT SP", error);
    throw error;
  }
}

// Sản phẩm liên quan
async function getRelated(id) {
  try {
    // Tìm sản phẩm với productId được cung cấp
    const product = await productModel.findById(id);
    // Trích xuất categoryId từ sản phẩm tìm được
    const categoryId = product.category.categoryId;

    // Tìm tất cả các sản phẩm trong cùng một category
    const relatedProducts = await productModel
      .find({
        "category.categoryId": categoryId,
        _id: { $ne: id }, // loại trừ sản phẩm hiện tại
      })
      .limit(4);
    console.log("Related Products in controller:", relatedProducts); // Kiểm tra kết quả trả về từ database

    return relatedProducts;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm liên quan", error);
    throw error;
  }
}

//Tìm kiếm sản phẩm theo  tên
async function search(name) {
  try {
    const result = await productModel.find(
      {
        name: { $regex: name, $options: "i" },
        isActive: true, // i :không phân biệt hoa thường
      },
      {
        name: 1,
        category: 1,
        image1: 1,
        publish: 1,
        author: 1,
        price1: 1,
        price2: 1,
        quantity: 1,
        isActive: 1,
      }
    );
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

//Lọc giá giản phẩm giảm dần
async function getDecrease() {
  try {
    const result = await productModel.find().sort({ price2: -1 }); // -1 laf giamr daanf
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

//Lọc giả sản phẩm tăng dần
async function getAscending() {
  try {
    const result = await productModel.find().sort({ price2: 1 });
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp theo key", error);
    throw error;
  }
}

//Lọc sản phẩm theo danh mục
async function getByCategory(category) {
  try {
    const productsCategory = await productModel.find({
      "category.categoryId": category,
    });
    return productsCategory;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm  theo ID danh mục", error);
    throw error;
  }
}

//Lọc sản phẩm theo publish
async function getByPublish(publish) {
  try {
    const productsPublish = await productModel.find({
      "publish.publishId": publish,
    });
    return productsPublish;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm  theo publish", error);
    throw error;
  }
}

//Lọc sản phẩm theo author
async function getByAuthor(author) {
  try {
    const productsAuthor = await productModel.find({
      "author.authorId": author,
    });
    return productsAuthor;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm  theo author", error);
    throw error;
  }
}
