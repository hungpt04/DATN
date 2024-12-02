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
            SELECT new com.example.da_be.response.KhachHangResponse(tk.id, tk.hoTen, tk.sdt, tk.email, tk.ngaySinh)
            from TaiKhoan tk
            where tk.vaiTro = 'Customer' and tk.trangThai = 0
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
"""
    )
    Page<VoucherResponse> getSearchVoucher(@Param("search") VoucherSearch search, Pageable pageable);
}
