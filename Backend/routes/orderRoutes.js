const express = require("express");
const router = express.Router();

const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus
} = require("../controllers/orderController");


router.put("/status/:id", updateOrderStatus);
// 📌 Lấy danh sách đơn hàng
router.get("/", getOrders);

// 📌 Lấy chi tiết 1 đơn hàng
router.get("/:id", getOrderById);

// 📌 Tạo đơn hàng mới
router.post("/create", createOrder);

// 📌 Cập nhật đơn hàng
router.put("/:id", updateOrder);

// 📌 Xóa đơn hàng
router.delete("/:id", deleteOrder);



module.exports = router;