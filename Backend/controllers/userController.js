// controllers/userController.js
const { poolPromise } = require('../config/db');

// =======================================================
// LOGIN
// =======================================================
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('username', username)
      .input('password', password)
      .query(`
        SELECT * FROM NhanVien 
        WHERE Username = @username AND PasswordHash = @password
      `);

    if (result.recordset.length > 0) {
      res.json({
        message: '✅ Đăng nhập thành công!',
        user: result.recordset[0],
      });
    } else {
      res.status(401).json({ message: '❌ Sai tên đăng nhập hoặc mật khẩu' });
    }
  } catch (err) {
    console.error('Lỗi đăng nhập:', err);
    res.status(500).json({ message: '❌ Lỗi server', error: err.message });
  }
};

// =======================================================
// LOGOUT
// =======================================================
exports.logoutUser = async (req, res) => {
  try {
    res.json({ message: '✅ Đăng xuất thành công!' });
  } catch (err) {
    console.error('❌ Lỗi đăng xuất:', err);
    res.status(500).json({ message: '❌ Lỗi server', error: err.message });
  }
};

// =======================================================
// CRUD NHÂN VIÊN
// =======================================================

// Lấy tất cả người dùng
exports.getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT * FROM NhanVien`);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Lỗi getUsers:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Lấy người dùng theo ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('id', id)
      .query(`SELECT * FROM NhanVien WHERE Id = @id`);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Lỗi getUserById:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Tạo người dùng mới
exports.createUser = async (req, res) => {
  try {
    const { Username, PasswordHash, FullName } = req.body;

    const pool = await poolPromise;
    await pool
      .request()
      .input('Username', Username)
      .input('PasswordHash', PasswordHash)
      .input('FullName', FullName)
      .query(`
        INSERT INTO NhanVien (Username, PasswordHash, FullName)
        VALUES (@Username, @PasswordHash, @FullName)
      `);

    res.json({ message: '✅ Tạo người dùng thành công!' });
  } catch (err) {
    console.error('❌ Lỗi createUser:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Cập nhật người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { FullName } = req.body;

    const pool = await poolPromise;
    await pool
      .request()
      .input('id', id)
      .input('FullName', FullName)
      .query(`
        UPDATE NhanVien SET FullName = @FullName WHERE Id = @id
      `);

    res.json({ message: '✅ Cập nhật thành công!' });
  } catch (err) {
    console.error('❌ Lỗi updateUser:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;
    await pool
      .request()
      .input('id', id)
      .query(`DELETE FROM NhanVien WHERE Id = @id`);

    res.json({ message: '🗑️ Xóa thành công!' });
  } catch (err) {
    console.error('❌ Lỗi deleteUser:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
