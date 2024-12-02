package com.example.da_be.repository;

import com.example.da_be.entity.KhachHang_Voucher;
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
}
