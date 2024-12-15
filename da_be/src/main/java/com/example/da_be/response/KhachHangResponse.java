package com.example.da_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangResponse {
    private Integer id;
    private String ma;
    private String hoTen;
    private String sdt;
    private String email;
    private String matKhau;
    private Integer gioiTinh;
    private String vaiTro;
    private String avatar;
    private LocalDate ngaySinh;
    private String cccd;
    private Integer trangThai;
}
