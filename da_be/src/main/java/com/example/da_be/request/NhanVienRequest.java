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
public class NhanVienRequest {
    private String hoTen;
    private String sdt;
    private String email;
    private Integer gioiTinh;
    private String vaiTro;
    private MultipartFile avatar;
    private LocalDate ngaySinh;
    private String cccd;
    private Integer trangThai;

    public TaiKhoan tranStaff(TaiKhoan nv) throws ParseException {
        nv.setHoTen(this.getHoTen());
        nv.setSdt(this.getSdt());
        nv.setEmail(this.getEmail());
        nv.setGioiTinh(this.getGioiTinh());
        nv.setVaiTro(this.getVaiTro());
        nv.setNgaySinh(this.getNgaySinh());
        nv.setCccd(this.getCccd());
        nv.setTrangThai(this.getTrangThai());
        return nv;
    }
}
