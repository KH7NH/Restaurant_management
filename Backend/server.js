const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { poolPromise } = require('./src/config/db');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const monanRoutes = require("./src/routes/monanRoutes");

app.use("/api/users", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/monan", monanRoutes);

poolPromise
  ?.then(() => console.log('✅ Kết nối cơ sở dữ liệu thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối SQL Server:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
