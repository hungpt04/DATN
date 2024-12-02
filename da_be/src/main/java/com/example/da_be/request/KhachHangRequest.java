package com.example.da_be.request;

import com.example.da_be.entity.TaiKhoan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangRequest {
    private String hoTen;

    private String sdt;

    private String email;

    private Integer gioiTinh;

    private String avatar;

    private LocalDate ngaySinh;

    private String vaiTro;

    private Integer trangThai;

    public TaiKhoan newKhachHang(TaiKhoan khachHang) {
        khachHang.setHoTen(this.getHoTen());
        khachHang.setSdt(this.getSdt());
        khachHang.setEmail(this.getEmail());
        khachHang.setGioiTinh(this.getGioiTinh());
        khachHang.setAvatar(this.getAvatar());
        khachHang.setNgaySinh(this.getNgaySinh());
        khachHang.setVaiTro(this.getVaiTro());
        khachHang.setTrangThai(this.getTrangThai());
        return khachHang;
    }
}
