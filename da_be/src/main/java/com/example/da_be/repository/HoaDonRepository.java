package com.example.da_be.repository;

import com.example.da_be.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Long> {
    @Query("SELECT h FROM HoaDon h WHERE h.trangThai = :trangThai")
    List<HoaDon> findByTrangThai(@Param("trangThai") int trangThai);

    Optional<HoaDon> findTopByOrderByIdDesc();

    @Query(
            """
        SELECT hd FROM HoaDon hd WHERE hd.taiKhoan.id = :idKH
"""
    )
    List<HoaDon> getHoaDonByIdKhachHang(Integer idKH);

    @Query(value = "SELECT " +
            "COUNT(DISTINCT h.Id) AS products, " +
            "SUM(CASE WHEN h.TrangThai = 7 THEN 1 ELSE 0 END) AS successOrders, " +
            "SUM(CASE WHEN h.TrangThai = 8 THEN 1 ELSE 0 END) AS cancelOrders, " +
            "SUM(CASE WHEN h.TrangThai = 9 THEN 1 ELSE 0 END) AS returnOrders " +
            "FROM HoaDon h " +
            "WHERE CAST(h.NgayTao AS DATE) = CAST(GETDATE() AS DATE)",
            nativeQuery = true)
    Map<String, Object> getStatisticsToday();

    @Query(value = "SELECT " +
            "COUNT(DISTINCT h.Id) AS products, " +
            "SUM(CASE WHEN h.TrangThai = 7 THEN 1 ELSE 0 END) AS successOrders, " +
            "SUM(CASE WHEN h.TrangThai = 8 THEN 1 ELSE 0 END) AS cancelOrders, " +
            "SUM(CASE WHEN h.TrangThai = 9 THEN 1 ELSE 0 END) AS returnOrders " +
            "FROM HoaDon h " +
            "WHERE h.NgayTao >= DATEADD(WEEK, -1, GETDATE())",
            nativeQuery = true)
    Map<String, Object> getStatisticsThisWeek();

    @Query(value = "SELECT " +
            "COUNT(DISTINCT h.Id) AS products, " +
            "SUM(CASE WHEN h.TrangThai = 7 THEN 1 ELSE 0 END) AS successOrders, " +
            "SUM(CASE WHEN h.TrangThai = 8 THEN 1 ELSE 0 END) AS cancelOrders, " +
            "SUM(CASE WHEN h.TrangThai = 9 THEN 1 ELSE 0 END) AS returnOrders " +
            "FROM HoaDon h " +
            "WHERE MONTH(h.NgayTao) = MONTH(GETDATE()) AND YEAR(h.NgayTao) = YEAR(GETDATE())",
            nativeQuery = true)
    Map<String, Object> getStatisticsThisMonth();

    @Query(value = "SELECT " +
            "COUNT(DISTINCT h.Id) AS products, " +
            "SUM(CASE WHEN h.TrangThai = 7 THEN 1 ELSE 0 END) AS successOrders, " +
            "SUM(CASE WHEN h.TrangThai = 8 THEN 1 ELSE 0 END) AS cancelOrders, " +
            "SUM(CASE WHEN h.TrangThai = 9 THEN 1 ELSE 0 END) AS returnOrders " +
            "FROM HoaDon h " +
            "WHERE YEAR(h.NgayTao) = YEAR(GETDATE())",
            nativeQuery = true)
    Map<String, Object> getStatisticsThisYear();

    // Thống kê doanh thu theo tháng
    @Query(value = "SELECT " +
            "MONTH(NgayTao) AS month, " +
            "COUNT(Id) AS orders, " +
            "SUM(TongTien) AS revenue " +
            "FROM HoaDon " +
            "WHERE YEAR(NgayTao) = YEAR(GETDATE()) " +
            "GROUP BY MONTH(NgayTao) " +
            "ORDER BY MONTH(NgayTao)",
            nativeQuery = true)
    List<Map<String, Object>> getMonthlySalesData();

    // Lấy các đơn hàng thành công
//    List<HoaDon> findByTrangThai(int trangThai);

    @Query(
            value = """
SELECT TOP 1 ha.Link FROM HoaDonCT hdct
JOIN HoaDon hd ON hd.id = hdct.IdHoaDon
JOIN SanPhamCT spct ON spct.id = hdct.IdSanPhamCT
JOIN HinhAnh ha ON ha.IdSanPhamCT = spct.id
WHERE hd.id = :id AND spct.id = :idSPCT

""", nativeQuery = true
    )
    Optional<String> getAnhSanPhamByHoaDonId(Long id, Integer idSPCT);

//    @Query(
//            value = """
//SELECT ha.Link
//FROM HoaDonCT hdct
//JOIN HoaDon hd ON hd.id = hdct.IdHoaDon
//JOIN SanPhamCT spct ON spct.id = hdct.IdSanPhamCT
//JOIN HinhAnh ha ON ha.IdSanPhamCT = spct.id
//WHERE hd.id = :id AND spct.id IN :idSPCT
//""",
//            nativeQuery = true
//    )
//    List<String> getAnhSanPhamByHoaDonId(Long id, List<Integer> idSPCT);
}

