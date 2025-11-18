const sql = require("mssql");
const { config } = require("../config/db");

function normalize(str) {
    return (str || "")
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

exports.createOrder = async (req, res) => {
    const { IDNV, TenKhachHang, GhiChu, ChiTiet, PhuongThucTT } = req.body;

    if (!TenKhachHang || !Array.isArray(ChiTiet) || ChiTiet.length === 0) {
        return res.status(400).json({ message: "Thiếu thông tin đơn hàng!" });
    }

    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Create DonHang
        const reqOrder = new sql.Request(transaction);
        reqOrder
            .input("IDNV", sql.Int, IDNV || 1)
            .input("TenKhachHang", sql.NVarChar, TenKhachHang)
            .input("GhiChu", sql.NVarChar, GhiChu || null);

        const insertOrder = await reqOrder.query(`
            INSERT INTO DonHang (IDNV, TenKhachHang, GhiChu)
            OUTPUT INSERTED.IDDonHang
            VALUES (@IDNV, @TenKhachHang, @GhiChu)
        `);

        const orderId = insertOrder.recordset[0].IDDonHang;

        // Add dish details
        for (const item of ChiTiet) {
            const reqDetail = new sql.Request(transaction);
            reqDetail
                .input("IDDonHang", sql.Int, orderId)
                .input("IDMA", sql.Int, item.IDMA)
                .input("SoLuong", sql.Int, item.SoLuong || 1)
                .input("GhiChu", sql.NVarChar, item.GhiChu || null);

            await reqDetail.query(`
                INSERT INTO ChiTietDonHang (IDDonHang, IDMA, SoLuong, GhiChu)
                VALUES (@IDDonHang, @IDMA, @SoLuong, @GhiChu)
            `);
        }

        // Calculate the total amount
        const totalRs = await new sql.Request(transaction)
            .input("IDDonHang", sql.Int, orderId)
            .query(`
                SELECT SUM(ma.Gia * ct.SoLuong) AS TongTien
                FROM ChiTietDonHang ct
                JOIN MonAn ma ON ma.IDMA = ct.IDMA
                WHERE ct.IDDonHang = @IDDonHang
            `);

        const TongTien = totalRs.recordset[0].TongTien || 0;

        // Create invoice
        await new sql.Request(transaction)
            .input("IDDonHang", sql.Int, orderId)
            .input("TongTien", sql.Decimal(10, 2), TongTien)
            .input("PhuongThucTT", sql.NVarChar, PhuongThucTT || "Tiền mặt")
            .query(`
                INSERT INTO HoaDon (IDDonHang, TongTien, PhuongThucTT)
                VALUES (@IDDonHang, @TongTien, @PhuongThucTT)
        `);

        await transaction.commit();

        res.json({
            message: "Tạo đơn thành công!",
            orderId,
            TongTien
        });

    } catch (err) {
        console.error("❌ Lỗi tạo đơn hàng:", err);
        await transaction.rollback();
        res.status(500).json({ message: err.message });
    }
};


// GET ORDER LIST
exports.getOrders = async (req, res) => {
    try {
        const pool = await sql.connect(config);

        const rs = await pool.query(`
            SELECT dh.IDDonHang, dh.TenKhachHang, dh.Ngay, dh.TrangThai,
                   hd.TongTien, hd.PhuongThucTT
            FROM DonHang dh
            LEFT JOIN HoaDon hd ON dh.IDDonHang = hd.IDDonHang
            ORDER BY dh.IDDonHang DESC
        `);

        res.json(rs.recordset);

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};


// GET DETAILS OF 1 ORDER
exports.getOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);

        // Get application information
        const order = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT * FROM DonHang WHERE IDDonHang = @id
            `);

        if (order.recordset.length === 0)
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

        // Get item details
        const details = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT ct.IDChiTiet, ct.IDMA, ma.TenMA, ma.Gia,
                       ct.SoLuong, ct.GhiChu
                FROM ChiTietDonHang ct
                JOIN MonAn ma ON ct.IDMA = ma.IDMA
                WHERE IDDonHang = @id
            `);

        // Get the invoice
        const invoice = await pool.request()
            .input("id", sql.Int, id)
            .query(`
                SELECT * FROM HoaDon WHERE IDDonHang = @id
            `);

        res.json({
            DonHang: order.recordset[0],
            ChiTiet: details.recordset,
            HoaDon: invoice.recordset[0] || null
        });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};


// ORDER STATUS UPDATE
exports.updateOrder = async (req, res) => {
    const { id } = req.params;
    const { TenKhachHang, GhiChu, TrangThai } = req.body;

    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("id", sql.Int, id)
            .input("TenKhachHang", sql.NVarChar, TenKhachHang)
            .input("GhiChu", sql.NVarChar, GhiChu)
            .input("TrangThai", sql.NVarChar, TrangThai)
            .query(`
                UPDATE DonHang
                SET TenKhachHang = @TenKhachHang,
                    GhiChu = @GhiChu,
                    TrangThai = @TrangThai
                WHERE IDDonHang = @id
            `);

        res.json({ message: "Cập nhật đơn hàng thành công!" });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};


//  DELETE ORDER
exports.deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        const pool = await sql.connect(config);

        // Delete details
        await pool.request()
            .input("id", sql.Int, id)
            .query(`DELETE FROM ChiTietDonHang WHERE IDDonHang = @id`);

        // Delete invoice
        await pool.request()
            .input("id", sql.Int, id)
            .query(`DELETE FROM HoaDon WHERE IDDonHang = @id`);

        // Delete order
        await pool.request()
            .input("id", sql.Int, id)
            .query(`DELETE FROM DonHang WHERE IDDonHang = @id`);

        res.json({ message: "Xoá đơn hàng thành công!" });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { TrangThai } = req.body;

    if (!TrangThai) {
        return res.status(400).json({ message: "Thiếu trạng thái!" });
    }

    try {
        const pool = await sql.connect(config);

        await pool.request()
            .input("id", sql.Int, id)
            .input("TrangThai", sql.NVarChar, TrangThai)
            .query(`
                UPDATE DonHang
                SET TrangThai = @TrangThai
                WHERE IDDonHang = @id
            `);

        res.json({ message: "Cập nhật trạng thái thành công!" });

    } catch (err) {
        res.status(500).json({ message: "Lỗi server!" });
    }
};