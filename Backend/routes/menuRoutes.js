const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

router.get("/", menuController.getAllFoods);
router.get("/:id", menuController.getFoodById);
router.put("/:id", menuController.updateFood);

module.exports = router;