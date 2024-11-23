const authorModel = require("../model/author.model");
const productModel = require("../model/product.model");
module.exports = {
  gettAll,
  insert,
  updateById,
  getByauthor,
  getauthorByName,
  deleteCate,
  getById,
};

async function gettAll() {
  try {
    const result = await authorModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy sp", error);
    throw error;
  }
}

async function getByauthor(author) {
  try {
    const productsauthor = await productModel.find({
      "author.authorId": author,
    });
    return productsauthor;
  } catch (error) {
    console.log("Lỗi lấy sản phẩm  theo ID author", error);
    throw error;
  }
}

async function getauthorByName(authorName) {
  try {
    const author = await authorModel.findOne({ name: authorName });
    return author;
  } catch (error) {
    throw error;
  }
}

// thêm author

async function insert(body) {
  try {
    const { name, description } = body;
    console.log("author Name:", name);
    console.log("author Mô tả:", description);

    const cateNew = new authorModel({ name, description });
    const result = await cateNew.save();
    return result;
  } catch (error) {
    console.error("Lỗi:", error);
    throw error;
  }
}

// cập nhật author theo id

async function updateById(id, body) {
  try {
    const cate = await authorModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy author");
    }
    const { name, description } = body;
    const result = await authorModel.findByIdAndUpdate(id, {
      name,
      description,
    });
    return result;
  } catch (error) {
    console.log("lỗi update", error);
    throw error;
  }
}

// xóa author theo id
async function deleteCate(id) {
  try {
    // kiểm tra xem trong author có sản phẩm nào không
    const pros = await productModel.find({ "author.authorId": id });
    if (pros.length > 0) {
      return { mess: "author có sản phẩm không thể xóa" };
    } else {
      const result = await authorModel.findByIdAndDelete(id);
      return result;
    }
  } catch (error) {
    console.log("LỖI XÓA author THEO ID", error);
    throw error;
  }
}

async function getById(id) {
  try {
    const proId = await authorModel.findById(id);
    return proId;
  } catch (error) {
    console.log("LỖI LAAYS CHI TIẾT SP", error);
    throw error;
  }
}
// xóa author theo id
// async function remove(id) {
//     try {
//         const result = await authorModel.findByIdAndDelete(id);
//         return result;
//     } catch (error) {
//         console.log('LỖI XÓA author THEO ID', error);
//         throw error;
//     }

// }
