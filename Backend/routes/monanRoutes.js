const express = require("express");
const router = express.Router();
const monanController = require("../controllers/monanController");

// Lấy tất cả món ăn
router.get("/", monanController.getAll);

// Lấy chi tiết 1 món
router.get("/:id", monanController.getOne);

// Cập nhật món ăn
router.put("/:id", monanController.update);

// (Tùy chọn) Thêm món mới
router.post("/", monanController.create);

// (Tùy chọn) Xoá món ăn
router.delete("/:id", monanController.deleteFood);

router.get("/page", monanController.getPaged);


module.exports = router;
