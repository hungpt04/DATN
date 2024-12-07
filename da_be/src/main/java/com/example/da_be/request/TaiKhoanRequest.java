package com.example.da_be.request;

import com.example.da_be.entity.TaiKhoan;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.text.ParseException;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaiKhoanRequest {
    private String hoTen;
    private String sdt;
    private String email;
    private String matKhau;
    private Integer gioiTinh;
    private String vaiTro;
    private MultipartFile avatar;
    private LocalDate ngaySinh;
    private String cccd;
    private Integer trangThai;

//    public TaiKhoan tranNhanVien(TaiKhoan taiKhoan) throws ParseException {
//        taiKhoan.setHoTen(this.getHoTen());
//        taiKhoan.setSdt(this.getSdt());
//        taiKhoan.setEmail(this.getEmail());
//        taiKhoan.setMatKhau(this.getMatKhau());
//        taiKhoan.setGioiTinh(this.getGioiTinh());
//        taiKhoan.setVaiTro(this.getVaiTro());
//
//        taiKhoan.setNgaySinh(this.getNgaySinh());
//        taiKhoan.setCccd(this.getCccd());
//        taiKhoan.setTrangThai(this.getTrangThai());
//        return taiKhoan;
//    }
}
