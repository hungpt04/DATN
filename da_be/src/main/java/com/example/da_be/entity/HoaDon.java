package com.example.da_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "HoaDon")
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @Column(name = "IdTaiKhoan")
    private Long idTaiKhoan;

    @Column(name = "IdVoucher")
    private Long idVoucher;

    @Column(name = "Ma")
    private String ma;

    @Column(name = "SoLuong")
    private Integer soLuong;

    @Column(name = "LoaiHoaDon")
    private String loaiHoaDon;

    @Column(name = "PhuongThucThanhToan")
    private String phuongThucThanhToan;

    @Column(name = "TenNguoiNhan")
    private String tenNguoiNhan;

    @Column(name = "SdtNguoiNhan")
    private String sdtNguoiNhan;

    @Column(name = "EmailNguoiNhan")
    private String emailNguoiNhan;

    @Column(name = "DiaChiNguoiNhan")
    private String diaChiNguoiNhan;

    @Column(name = "PhiShip")
    private int phiShip;

    @Column(name = "TongTien")
    private int tongTien;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgayTao")
    private Date ngayTao;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "NgaySua")
    private Date ngaySua;

    @Column(name = "TrangThai")
    private int trangThai;
}
