// controllers/userController.js
const { poolPromise } = require('../config/db');
// LOGIN
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

// LOGOUT
exports.logoutUser = async (req, res) => {
  try {
    res.json({ message: '✅ Đăng xuất thành công!' });
  } catch (err) {
    console.error('❌ Lỗi đăng xuất:', err);
    res.status(500).json({ message: '❌ Lỗi server', error: err.message });
  }
};

// Get all users
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

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('id', id)
      .query(`SELECT * FROM NhanVien WHERE IDNV = @id`);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Lỗi getUserById:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { TenNV, Username, PasswordHash, VaiTro } = req.body;

    const pool = await poolPromise;
    await pool
      .request()
      .input('TenNV', TenNV)
      .input('Username', Username)
      .input('PasswordHash', PasswordHash)
      .input('VaiTro', VaiTro)
      .query(`
        INSERT INTO NhanVien (TenNV, Username, PasswordHash, VaiTro)
        VALUES (@TenNV, @Username, @PasswordHash, @VaiTro)
      `);

    res.json({ message: '✅ Tạo người dùng thành công!' });

  } catch (err) {
    console.error('❌ Lỗi createUser:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Update users
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { TenNV, VaiTro } = req.body;

    const pool = await poolPromise;
    await pool
      .request()
      .input('id', id)
      .input('TenNV', TenNV)
      .input('VaiTro', VaiTro)
      .query(`
        UPDATE NhanVien 
        SET TenNV = @TenNV, VaiTro = @VaiTro
        WHERE IDNV = @id
      `);

    res.json({ message: '✅ Cập nhật thành công!' });

  } catch (err) {
    console.error('❌ Lỗi updateUser:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Delete users
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const pool = await poolPromise;
    await pool
      .request()
      .input('id', id)
      .query(`DELETE FROM NhanVien WHERE IDNV = @id`);

    res.json({ message: '🗑️ Xóa thành công!' });

  } catch (err) {
    console.error('❌ Lỗi deleteUser:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
