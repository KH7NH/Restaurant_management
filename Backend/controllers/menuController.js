const sql = require("mssql");
const { poolPromise } = require("../config/db");

// Lấy tất cả món ăn
exports.getAllFoods = async (req, res) => {
  try {
    const pool = await poolPromise;
    const rs = await pool.query("SELECT * FROM MonAn");
    res.json(rs.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy món theo ID
exports.getFoodById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const rs = await pool
      .request()
      .input("IDMA", sql.Int, req.params.id)
      .query("SELECT * FROM MonAn WHERE IDMA = @IDMA");

    if (rs.recordset.length === 0)
      return res.status(404).json({ message: "Không tìm thấy món ăn" });

    res.json(rs.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật món ăn
exports.updateFood = async (req, res) => {
  try {
    const { TenMA, Gia, MoTa, AnhMon, TrangThai } = req.body;
    const pool = await poolPromise;

    await pool
      .request()
      .input("IDMA", sql.Int, req.params.id)
      .input("TenMA", sql.NVarChar, TenMA)
      .input("Gia", sql.Decimal(10, 2), Gia)
      .input("MoTa", sql.NVarChar, MoTa)
      .input("AnhMon", sql.NVarChar, AnhMon)
      .input("TrangThai", sql.NVarChar, TrangThai)
      .query(`
        UPDATE MonAn
        SET TenMA=@TenMA, Gia=@Gia, MoTa=@MoTa, AnhMon=@AnhMon, TrangThai=@TrangThai
        WHERE IDMA = @IDMA
      `);

    res.json({ message: "Cập nhật thành công!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
