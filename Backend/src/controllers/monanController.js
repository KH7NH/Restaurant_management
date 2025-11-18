const { sql, poolPromise } = require("../config/db");

// ======================== Get all the food ========================
exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

    const pool = await poolPromise;

    // Query list
    const result = await pool.request()
      .input("search", sql.NVarChar, `%${search}%`)
      .input("offset", sql.Int, offset)
      .input("limit", sql.Int, limit)
      .query(`
        SELECT *
        FROM MonAn
        WHERE TenMA LIKE @search
        ORDER BY IDMA DESC
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    // Query total number of dishes (pagination service)
    const countResult = await pool.request()
      .input("search", sql.NVarChar, `%${search}%`)
      .query(`
        SELECT COUNT(*) AS total
        FROM MonAn
        WHERE TenMA LIKE @search
      `);

    const total = countResult.recordset[0].total;

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: result.recordset
    });

  } catch (err) {
    console.error("Lỗi getAll:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ======================== Get 1 item by ID ========================
exports.getOne = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query(`SELECT * FROM MonAn WHERE IDMA = @id`);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy món ăn" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Lỗi getOne:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ======================== Update dishes ========================
exports.update = async (req, res) => {
  const { id } = req.params;
  const { TenMA, Gia, TrangThai, MoTa, AnhMon } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("TenMA", sql.NVarChar, TenMA)
      .input("Gia", sql.Decimal(10, 2), Gia)
      .input("TrangThai", sql.NVarChar, TrangThai)
      .input("MoTa", sql.NVarChar, MoTa)
      .input("AnhMon", sql.NVarChar, AnhMon)
      .query(`
        UPDATE MonAn
        SET TenMA = @TenMA,
            Gia = @Gia,
            TrangThai = @TrangThai,
            MoTa = @MoTa,
            AnhMon = @AnhMon
        WHERE IDMA = @id
      `);

    res.json({ message: "Cập nhật món ăn thành công" });
  } catch (err) {
    console.error("Lỗi update:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ======================== Add dishes ========================
exports.create = async (req, res) => {
  const { TenMA, Gia, TrangThai, MoTa, AnhMon } = req.body;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("TenMA", sql.NVarChar, TenMA)
      .input("Gia", sql.Decimal(10, 2), Gia)
      .input("TrangThai", sql.NVarChar, TrangThai)
      .input("MoTa", sql.NVarChar, MoTa)
      .input("AnhMon", sql.NVarChar, AnhMon)
      .query(`
        INSERT INTO MonAn (TenMA, Gia, TrangThai, MoTa, AnhMon)
        OUTPUT INSERTED.IDMA
        VALUES (@TenMA, @Gia, @TrangThai, @MoTa, @AnhMon)
      `);

    res.json({ message: "Thêm món thành công", IDMA: result.recordset[0].IDMA });
  } catch (err) {
    console.error("Lỗi create:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ======================== Delete dish ========================
exports.deleteFood = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("IDMA", sql.Int, id)
      .query("DELETE FROM MonAn WHERE IDMA = @IDMA");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Món ăn không tồn tại" });
    }

    res.json({ message: "Xóa món thành công!" });

  } catch (err) {
    console.error("🔥 Lỗi khi xóa món:", err);
    res.status(500).json({ message: "Lỗi khi xóa món" });
  }
};

// ======================== Get a paginated list of items ========================
exports.getPaged = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    const pool = await poolPromise;

    // Get the current page list
    const result = await pool.request()
      .input("limit", sql.Int, limit)
      .input("offset", sql.Int, offset)
      .query(`
        SELECT IDMA, TenMA, Gia, TrangThai, MoTa, AnhMon
        FROM MonAn
        ORDER BY IDMA DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `);

    // Get the total number of items
    const totalQuery = await pool.request().query(`
      SELECT COUNT(*) AS total FROM MonAn
    `);

    const total = totalQuery.recordset[0].total;
    const totalPages = Math.ceil(total / limit);

    res.json({
      page,
      limit,
      total,
      totalPages,
      data: result.recordset
    });

  } catch (err) {
    console.error("Lỗi phân trang:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

