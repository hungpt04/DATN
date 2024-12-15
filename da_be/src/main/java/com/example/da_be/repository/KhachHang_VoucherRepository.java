package com.example.da_be.repository;

import com.example.da_be.entity.KhachHang_Voucher;
import com.example.da_be.entity.Voucher;
import com.example.da_be.response.VoucherResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachHang_VoucherRepository extends JpaRepository<KhachHang_Voucher, Integer> {
    @Query(
            """
            SELECT kv.taiKhoan.id
            from KhachHang_Voucher kv
            where kv.voucher.id = :idVoucher

            """
    )
    List<Integer> getListIdKhachHangByIdVoucher(@Param("idVoucher") Integer idVoucher);

    @Query(
            """
            SELECT kv
            from KhachHang_Voucher kv
            where kv.voucher.id = :idVoucher
            """
    )
    List<KhachHang_Voucher> getListKhachHangVoucherByIdVoucher(Integer idVoucher);

    @Query(
            """
            select v from Voucher v join KhachHang_Voucher kv on v.id = kv.voucher.id
            where kv.id = :idKhachHang
"""
    )
    List<Voucher> getListVoucherByIdKhachHang(Integer idKhachHang);

    @Query(
            """
        SELECT v
        FROM Voucher v
        WHERE v.trangThai = 1
          AND v.soLuong > 0
          AND v.kieu = 0
        ORDER BY v.id desc
    """)
    List<Voucher> getVoucherPublic();

    @Query(
            """
        SELECT v
        FROM Voucher v
        JOIN KhachHang_Voucher kv ON v.id = kv.voucher.id
        WHERE v.trangThai = 1
          AND v.soLuong > 0
          AND v.kieu = 1
          AND kv.taiKhoan.id = :idKhachHang
          AND (
              :idKhachHang IS NULL
              OR NOT EXISTS (
                  SELECT 1
                  FROM HoaDon h
                  WHERE h.idVoucher = v.id
                    AND h.trangThai <> 0
                    AND h.taiKhoan.id = :idKhachHang
              )
          )
        ORDER BY v.id
    """)
    List<Voucher> getVoucherPrivate(Integer idKhachHang);

}
