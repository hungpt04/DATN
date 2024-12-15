package com.example.da_be.request;

import com.example.da_be.entity.TaiKhoan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

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

    private MultipartFile avatar;

    private LocalDate ngaySinh;

    private String vaiTro;

    private Integer trangThai;

    public TaiKhoan newKhachHang(TaiKhoan khachHang) {
        khachHang.setHoTen(this.getHoTen());
        khachHang.setSdt(this.getSdt());
        khachHang.setEmail(this.getEmail());
        khachHang.setGioiTinh(this.getGioiTinh());
        khachHang.setNgaySinh(this.getNgaySinh());
        khachHang.setVaiTro(this.getVaiTro());
        khachHang.setTrangThai(this.getTrangThai());
        return khachHang;
    }
}
