const productModel = require("../model/product.model");
const favoriteModel = require("../model/favorite.model");

module.exports = {
  addFavorite,
  getFavorites,
};
async function addFavorite(req, res) {
  try {
    const { productId, userId } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const favoriteExists = await favoriteModel.findOne({ userId, productId });
    if (favoriteExists) {
      console.log("Favorite already exists for user:", userId);
      return res
        .status(400)
        .json({ message: "Sản phẩm đã có trong danh sách yêu thích" });
    }

    const newFavorite = new favoriteModel({
      userId,
      productId,
    });

    await newFavorite.save();

    console.log("Favorite added successfully");
    return res.status(200).json({
      message: "Đã thêm sản phẩm vào danh sách yêu thích",
      favorite: newFavorite,
    });
  } catch (error) {
    console.error("Error in addFavorite:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message || error });
    }
  }
}
async function getFavorites(req, res) {
  try {
    const { userId } = req.params;

    const favorites = await favoriteModel.find({ userId });

    if (!favorites.length) {
      return res
        .status(404)
        .json({ message: "Không có sản phẩm yêu thích nào." });
    }

    return favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Lỗi server", error: error.message || error });
    }
  }
}
