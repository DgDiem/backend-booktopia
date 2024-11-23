const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
module.exports = {
  gettAll,
  updateById,
  register,
  getUserById,
  login,
  remove,
};

// Đăng ký
async function register(body) {
  try {
    const { name, username, email, password, role } = body;
    console.log("body register:", name);

    let user = await userModel.findOne({ email: email });
    if (user) {
      throw { statusCode: 409, message: "Email đã tồn tại" }; // 409 Conflict
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    user = new userModel({
      uid: uuidv4(), // Tạo một uid duy nhất (UUID) cho người dùng
      name,
      username,
      email,
      password: hash,
      role: role || 0,
      image:
        "https://images.unsplash.com/photo-1686170287433-c95faf6d3608?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1wYXJ0bmVy", // Ảnh mặc định
    });

    const result = await user.save();
    return result;
  } catch (error) {
    console.log("Lỗi đăng ký:", error);
    throw error;
  }
}

// Đăng nhập
async function login(body) {
  try {
    const { email, password } = body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
      throw { statusCode: 404, message: "Email không tồn tại" }; // 404 Not Found
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { statusCode: 401, message: "Mật khẩu không chính xác" }; // 401 Unauthorized
    }

    delete user._doc.password;

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email, name: user.name, role: user.role },
      "access_token_secret",
      { expiresIn: "1m" }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, email: user.email, name: user.name, role: user.role },
      "refresh_token_secret",
      { expiresIn: "1h" }
    );

    return { user: user, accessToken: accessToken, refreshToken: refreshToken };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
}

// Cập nhật user
async function updateById(id, body) {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw { statusCode: 404, message: "Không tìm thấy user" }; // 404 Not Found
    }

    const { name, username, image, password, email, phone, date, address, role } = body;

    let updatedFields = { name, username, email, phone, date, address, role };

    if (image) {
      updatedFields.image = image;
    }
    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10);
    }

    const result = await userModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    return result;
  } catch (error) {
    console.log("Lỗi cập nhật:", error);
    throw error;
  }
}

// Lấy thông tin user theo ID
async function getUserById(id) {
  try {
    const user = await userModel.findById(id);
    if (!user) {
      throw { statusCode: 404, message: "Lấy chi tiết user không thành công" }; // 404 Not Found
    }
    return user;
  } catch (error) {
    console.log("Lỗi:", error);
    throw error;
  }
}

// Lấy danh sách tất cả user
async function gettAll() {
  try {
    const result = await userModel.find();
    return result;
  } catch (error) {
    console.log("Lỗi lấy danh sách user:", error);
    throw error;
  }
}

// Xóa user theo ID
async function remove(id) {
  try {
    const result = await userModel.findByIdAndDelete(id);
    if (!result) {
      throw { statusCode: 404, message: "Không tìm thấy user để xóa" }; // 404 Not Found
    }
    return result;
  } catch (error) {
    console.log("Lỗi xóa user theo ID:", error);
    throw error;
  }
}

// async function login(body) {
//     try {
//         // lấy dữ liệu
//         const {email , pass} = body;
//         // kiem tra email
//         let user = await userModel.findOne({email : email})
//         if (!user) {
//             throw new Error('Email khong ton tai')
//         }
//         // kiểm tra pass
//         const checkpass = bcrypt.compareSync(pass, user.pass)
//         if (!checkpass) {
//             throw new Error('Mật khẩu không chính xác')
//         }
//         //xóa field pass
//         delete user._doc.pass
//         // tạo token
//         const token = jwt.sign(
//             {_id : user._id, email : user.email, role : user.role},
//             'duongdiem', // key secret
//             {expiresIn: 1 * 1 *60 } // thời gian hết hạn của token
//         )

//         user = {...user._doc, token}
//         return user
//     } catch (error) {
//         console.log('LỖI', error);
//         throw error;
//     }
// }
//muốn xem sản phẩm mới thì người dùng cần đăng nhập để xem sp mới thì mình làm cái kiểm tra bằng token
