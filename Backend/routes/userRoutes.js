// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 🔐 LOGIN / LOGOUT
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

// 👥 CRUD người dùng
router.get('/', userController.getUsers);           // Lấy danh sách
router.get('/:id', userController.getUserById);     // Lấy theo ID
router.post('/', userController.createUser);        // Thêm
router.put('/:id', userController.updateUser);      // Sửa
router.delete('/:id', userController.deleteUser);   // Xóa

module.exports = router;
