// config/db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false, // đặt false nếu chạy local
    trustServerCertificate: true,
  },
};

// ✅ Kết nối SQL Server
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Đã kết nối SQL Server thành công!');
    return pool;
  })
  .catch(err => {
    console.error('❌ Lỗi kết nối SQL Server:', err);
  });

// ✅ Export chính xác
module.exports = {
  sql,
  poolPromise,
  config
};
