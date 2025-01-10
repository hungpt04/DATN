package com.example.da_be.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class HoaDonKHResponse {
    private Integer hoaDonId;
    private String tenNguoiNhan;
    private String sdtNguoiNhan;
    private String diaChiNguoiNhan;
    private BigDecimal tongTien;
    private BigDecimal phiShip;
    private String sanPhamTen;
    private BigDecimal giaBan;
    private Integer giaKhuyenMai;
    private Integer soLuongMua;
    private String hinhAnhLink;
    private Integer giaTriVoucher;
    private Integer kieuGiaTriVoucher;
    private Integer trangThai;
}
