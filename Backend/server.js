const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { poolPromise } = require('./config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Import routes
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes");
const monanRoutes = require("./routes/monanRoutes");

// ✅ Gắn route
app.use("/api/users", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/monan", monanRoutes);

// ✅ Kiểm tra kết nối DB
poolPromise
  ?.then(() => console.log('✅ Kết nối cơ sở dữ liệu thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối SQL Server:', err));

// ✅ Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
