const express = require("express");
const router = express.Router();
const monanController = require("../controllers/monanController");

// Get all the food
router.get("/", monanController.getAll);

// Get details of 1 item
router.get("/:id", monanController.getOne);

// Update dishes
router.put("/:id", monanController.update);

// Add new dishes
router.post("/", monanController.create);

// Delete dishes
router.delete("/:id", monanController.deleteFood);

router.get("/page", monanController.getPaged);


module.exports = router;
