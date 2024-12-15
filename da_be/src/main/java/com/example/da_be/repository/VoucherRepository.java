package com.example.da_be.repository;

import com.example.da_be.entity.Voucher;
import com.example.da_be.request.VoucherSearch;
import com.example.da_be.response.KhachHangResponse;
import com.example.da_be.response.VoucherResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    @Query(
            """
        SELECT new com.example.da_be.response.VoucherResponse(v.id, v.ma, v.ten, v.giaTri, v.giaTriMax, v.dieuKienNhoNhat, v.kieu, v.soLuong, v.ngayBatDau, v.ngayKetThuc, v.trangThai,  v.kieuGiaTri)
        FROM Voucher v
    """
    )
    List<VoucherResponse> getAllVoucher();

    @Query(
            """
        SELECT new com.example.da_be.response.VoucherResponse(v.id, v.ma, v.ten, v.giaTri, v.giaTriMax, v.dieuKienNhoNhat, v.kieu, v.soLuong, v.ngayBatDau, v.ngayKetThuc, v.trangThai,  v.kieuGiaTri)
        FROM Voucher v
    """
    )
    Page<VoucherResponse> phanTrangVoucher(Pageable pageable);

    @Query(
            """
            SELECT new com.example.da_be.response.KhachHangResponse(tk.id, tk.ma, tk.hoTen, tk.sdt, tk.email, tk.matKhau, tk.gioiTinh, tk.vaiTro, tk.avatar, tk.ngaySinh, tk.cccd, tk.trangThai)
            from TaiKhoan tk
            where tk.vaiTro = 'Customer' and tk.trangThai = 1
"""
    )
    List<KhachHangResponse> getAllKhachHang();

    @Query(
            """
        SELECT new com.example.da_be.response.VoucherResponse(v.id, v.ma, v.ten, v.giaTri, v.giaTriMax, v.dieuKienNhoNhat, v.kieu, v.soLuong, v.ngayBatDau, v.ngayKetThuc, v.trangThai,  v.kieuGiaTri)
        FROM Voucher v
        WHERE v.id = :id
    """
    )
    VoucherResponse getVoucherById(Integer id);

    @Query(
            """
            SELECT new com.example.da_be.response.VoucherResponse(v.id, v.ma, v.ten, v.giaTri, v.giaTriMax, v.dieuKienNhoNhat, v.kieu, v.soLuong, v.ngayBatDau, v.ngayKetThuc, v.trangThai,  v.kieuGiaTri)
            from Voucher v
            where 
            (:#{#search.tenSearch} is null or v.ma like %:#{#search.tenSearch}% or v.ten like %:#{#search.tenSearch}%)
            AND (:#{#search.ngayBatDauSearch} IS NULL OR v.ngayBatDau >= :#{#search.ngayBatDauSearch})
            AND (:#{#search.ngayKetThucSearch} IS NULL OR v.ngayKetThuc <= :#{#search.ngayKetThucSearch})
            AND (:#{#search.kieuSearch} IS NULL OR v.kieu = :#{#search.kieuSearch})
            AND (:#{#search.kieuGiaTriSearch} IS NULL OR v.kieuGiaTri = :#{#search.kieuGiaTriSearch})
            AND (:#{#search.trangThaiSearch} IS NULL OR v.trangThai = :#{#search.trangThaiSearch})
            ORDER BY v.id DESC
            """
    )
    Page<VoucherResponse> getSearchVoucher(@Param("search") VoucherSearch search, Pageable pageable);

    @Query(
            """
            SELECT distinct v.ma
            FROM Voucher v
"""
    )
    List<String> getAllMaVoucher();

    @Query(
            """
            SELECT distinct v.ten
            FROM Voucher v
"""
    )
    List<String> getAllTenVoucher();

    @Query(
            """
            SELECT v
            FROM Voucher v
            WHERE (v.ngayBatDau > :dateNow and v.trangThai != 0)
            OR (v.ngayKetThuc <= :dateNow and v.trangThai != 2)
            OR ((v.ngayBatDau <= v.ngayKetThuc and v.ngayKetThuc > :dateNow) and v.trangThai != 1)
"""
    )
    List<Voucher> getAllVoucherWrong(LocalDateTime dateNow);
}
