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
// Get order list
router.get("/", getOrders);

// Get details of 1 order
router.get("/:id", getOrderById);

// Create new order
router.post("/create", createOrder);

// Update orders
router.put("/:id", updateOrder);

// Delete order
router.delete("/:id", deleteOrder);



module.exports = router;