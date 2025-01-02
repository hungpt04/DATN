package com.example.da_be.repository;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.request.HoaDonKHRequest;
import com.example.da_be.response.HoaDonKHResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonKHRepository extends JpaRepository<HoaDon, Long> {
//    @Query(
//            value = "SELECT " +
//                    "    h.Id, " + // Thêm dấu phẩy ở đây
//                    "    h.TongTien, " + // Thêm dấu phẩy ở đây
//                    "    h.PhiShip, " + // Thêm dấu phẩy ở đây
//                    "    CONCAT(" +
//                    "        sp.Ten, ' - ', " +
//                    "        COALESCE(cl.Ten, ''), ' - ', " +
//                    "        COALESCE(dc.Ten, ''), ' - ', " +
//                    "        COALESCE(dcung.Ten, ''), ' - ', " +
//                    "        COALESCE(ms.Ten, ''), ' - ', " +
//                    "        COALESCE(th.Ten, ''), ' - ', " +
//                    "        COALESCE(tl.Ten, '')" +
//                    "    ) AS sanPhamTen, " +
//                    "    spct.DonGia, " + // Thêm dấu phẩy ở đây
//                    "    hdct.SoLuong, " + // Thêm dấu phẩy ở đây
//                    "    ha.Link " + // Thêm dấu phẩy ở đây
//                    "FROM " +
//                    "    [BACKET].[dbo].[HoaDon] h " +
//                    "JOIN " +
//                    "    [BACKET].[dbo].[HoaDonCT] hdct ON h.Id = hdct.IdHoaDon " +
//                    "JOIN " +
//                    "    [BACKET].[dbo].[SanPhamCT] spct ON hdct.IdSanPhamCT = spct.Id " +
//                    "JOIN " +
//                    "    [BACKET].[dbo].[SanPham] sp ON spct.IdSanPham = sp.Id " +
//                    "LEFT JOIN " +
//                    "    [BACKET].[dbo].[HinhAnh] ha ON spct.Id = ha.IdSanPhamCT " +
//                    "LEFT JOIN " +
//                    "    [BACKET].[dbo].[ChatLieu] cl ON spct.IdChatLieu = cl.Id " +
//                    "LEFT JOIN " +
//                    "    [BACKET].[dbo].[DiemCanBang] dc ON spct.IdDiemCanBang = dc.Id " +
//                    "LEFT JOIN " +
//                    "    [BACKET].[dbo].[DoCung] dcung ON spct.IdDoCung = dcung.Id " +
//                    "LEFT JOIN " +
//                    "    [BACKET].[dbo].[MauSac] ms ON spct.IdMauSac = ms.Id " +
//                    "LEFT JOIN " +
//                    "    [BACKET].[dbo].[ThuongHieu] th ON spct.IdThuongHieu = th.Id " +
//                    "LEFT JOIN " +
//                    "    [BACKET].[dbo].[TrongLuong] tl ON spct.IdTrongLuong = tl.Id " +
//                    "WHERE " +
//                    "    h.Id = :idHoaDon",
//            nativeQuery = true
//    )
//    List<HoaDonKHResponse> getHoaDonKHByIdHoaDon(@Param("idHoaDon") Long idHoaDon);

    @Query(
            value = "SELECT " +
                    "    h.Id, " +
                    "    h.TenNguoiNhan, " +
                    "    h.SdtNguoiNhan, " +
                    "    h.DiaChiNguoiNhan, " +
                    "    h.TongTien, " +
                    "    h.PhiShip, " +
                    "    CONCAT(" +
                    "        sp.Ten, ' - ', " +
                    "        COALESCE(cl.Ten, ''), ' - ', " +
                    "        COALESCE(dc.Ten, ''), ' - ', " +
                    "        COALESCE(dcung.Ten, ''), ' - ', " +
                    "        COALESCE(ms.Ten, ''), ' - ', " +
                    "        COALESCE(th.Ten, ''), ' - ', " +
                    "        COALESCE(tl.Ten, '')" +
                    "    ) AS sanPhamTen, " +
                    "    spct.DonGia, " +
                    "    hdct.SoLuong, " +
                    "    ha.Link " +
                    "FROM " +
                    "    [BACKET].[dbo].[HoaDon] h " +
                    "JOIN " +
                    "    [BACKET].[dbo].[HoaDonCT] hdct ON h.Id = hdct.IdHoaDon " +
                    "JOIN " +
                    "    [BACKET].[dbo].[SanPhamCT] spct ON hdct.IdSanPhamCT = spct.Id " +
                    "JOIN " +
                    "    [BACKET].[dbo].[SanPham] sp ON spct.IdSanPham = sp.Id " +
                    "LEFT JOIN " +
                    "    [BACKET].[dbo].[HinhAnh] ha ON spct.Id = ha.IdSanPhamCT " +
                    "LEFT JOIN " +
                    "    [BACKET].[dbo].[ChatLieu] cl ON spct.IdChatLieu = cl.Id " +
                    "LEFT JOIN " +
                    "    [BACKET].[dbo].[DiemCanBang] dc ON spct.IdDiemCanBang = dc.Id " +
                    "LEFT JOIN " +
                    "    [BACKET].[dbo].[DoCung] dcung ON spct.IdDoCung = dcung.Id " +
                    "LEFT JOIN " +
                    "    [BACKET].[dbo].[MauSac] ms ON spct.IdMauSac = ms.Id " +
                    "LEFT JOIN " +
                    "    [BACKET].[dbo].[ThuongHieu] th ON spct.IdThuongHieu = th.Id " +
                    "LEFT JOIN " +
                    "    [BACKET].[dbo].[TrongLuong] tl ON spct.IdTrongLuong = tl.Id " +
                    "WHERE " +
                    "    h.Id = :idHoaDon",
            nativeQuery = true
    )
    List<Object[]> getHoaDonKHByIdHoaDon(@Param("idHoaDon") Long idHoaDon);
}
