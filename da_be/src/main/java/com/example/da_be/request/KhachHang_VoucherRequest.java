package com.example.da_be.request;

import com.example.da_be.entity.KhachHang_Voucher;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.entity.Voucher;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHang_VoucherRequest {
    private TaiKhoan taiKhoan;
    private Voucher voucher;

    public KhachHang_Voucher newKhachHang_Voucher(KhachHang_Voucher khachHang_voucher) {
        khachHang_voucher.setTaiKhoan(this.getTaiKhoan());
        khachHang_voucher.setVoucher(this.getVoucher());
        return khachHang_voucher;
    }
}
