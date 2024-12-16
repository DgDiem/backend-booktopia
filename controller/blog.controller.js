const blogModel = require("../model/blog.model");

module.exports = {
  getAll,
  insert,
  getBlogById,
  updateById,
  remove,
  findByName,
  getNewBlog,
  updateStatusById,
  getAllAdmin
};

//hiển thị tất cả bài viết
async function getAll() {
  try {
    const result = await blogModel.find({ isActive: true });
    return result;
  } catch (error) {
    console.log("Lỗi lấy bài viết", error);
    throw error;
  }
}
async function getAllAdmin() {
  try {
    const result = await blogModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy bài viết", error);
    throw error;
  }
}

//thêm bài viết
async function insert(body) {
  try {
    const { name, date, image, content } = body;

    // Kiểm tra các giá trị đầu vào
    if (!name || !date || !content) {
      throw new Error("Tên bài viết, ngày viết và nội dung là bắt buộc.");
    }

    // Tạo một đối tượng mới từ mô hình blogModel
    const newBlog = new blogModel({
      name,
      date,
      image, // Có thể là URL hoặc đường dẫn
      content,
    });

    // Lưu đối tượng vào cơ sở dữ liệu
    const result = await newBlog.save();

    // Trả kết quả khi lưu thành công
    return result;
  } catch (error) {
    // Ghi log lỗi và ném lỗi để xử lý ở nơi khác nếu cần
    console.error("Lỗi thêm bài viết:", error);
    throw new Error("Có lỗi xảy ra khi thêm bài viết. Vui lòng thử lại.");
  }
}

//sửa bài viết
async function updateById(id, body) {
  try {
    const blog = await blogModel.findById(id);
    if (!blog) {
      throw new Error("Không tìm thấy bài viết");
    }
    const { name, image, content, date } = body;
    const result = await blogModel.findByIdAndUpdate(id, {
      name,
      image,
      date,
      content,
    });
    return result;
  } catch (error) {
    console.log("Lỗi cập nhật bài viết", error);
    throw error;
  }
}

// xóa bài viết theo id
async function remove(id) {
  try {
    const result = await blogModel.findByIdAndDelete(id);
    return result;
  } catch (error) {
    console.log("Lỗi xóa bài viết", error);
    throw error;
  }
}

//tìm kiếm bài viết theo tên
async function findByName(name) {
  try {
    const regexName = name.replace(/\s/g, ".*");
    const results = await blogModel.find({
      name: { $regex: regexName, $options: "i" },
    });
    return results;
  } catch (error) {
    console.log("Lỗi tìm kiếm bài viết", error);
    throw error;
  }
}

//lọc bài viết theo ngày
async function getNewBlog() {
  try {
    const results = await blogModel.find().sort({ date: -1 }).limit(4);
    return results;
  } catch (error) {
    console.log("Lỗi lấy danh sách sản phẩm mới:", error.message);
    throw error;
  }
}

// chi tiết blog

async function getBlogById(id) {
  try {
    const blogId = await blogModel.findById(id);
    return blogId;
  } catch (error) {
    console.log("LỖI LAAYS CHI TIẾT SP", error);
    throw error;
  }
}
//hiển thị bài viết theo id
// async function getBlogById(blogId) {
//   try {
//     const result = await blogModel.findById(blogId);
//     return result;
//   } catch (error) {
//     console.log("Lỗi lấy bài viết theo id", error);
//     throw error;
//   }
// }

async function updateStatusById(id, isActive) {
  try {
    const cate = await blogModel.findById(id);
    if (!cate) {
      throw new Error("Không tìm thấy bài viết");
    }
    const result = await blogModel.findByIdAndUpdate(
      id,
      { isActive },
      { new: true } 
    );
    return result;
  } catch (error) {
    throw error;
  }
}
