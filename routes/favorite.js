var express = require("express");
var router = express.Router();
const favoriteController = require("../controller/favorite.controller");
const authen = require("../middleware/authen");

router.post("/add", [authen([1])], async (req, res) => {
  try {
    const result = await favoriteController.addFavorite(req, res);
    if (result.error) {
      return res.status(500).json({ message: result.error });
    }
    return res.status(200).json(result.data);
  } catch (error) {
    console.error("Error in route handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const favorites = await favoriteController.getFavorites(req, res);
    if (favorites.error) {
      return res.status(500).json({ message: favorites.error });
    }
    return res.status(200).json(favorites);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
