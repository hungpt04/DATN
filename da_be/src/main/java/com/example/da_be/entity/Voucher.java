package com.example.da_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Voucher")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Ma")
    private String ma;

    @Column(name = "Ten")
    private String ten;

    @Column(name = "GiaTri")
    private Integer giaTri;

    @Column(name = "GiaTriMax")
    private Integer giaTriMax;

    @Column(name = "Kieu")
    private Integer kieu;

    @Column(name = "KieuGiaTri")
    private Integer kieuGiaTri;

    @Column(name = "SoLuong")
    private Integer soLuong;

    @Column(name = "DieuKienNhoNhat")
    private Integer dieuKienNhoNhat;

    @Column(name = "NgayBatDau")
    private LocalDateTime ngayBatDau;

    @Column(name = "NgayKetThuc")
    private LocalDateTime ngayKetThuc;

    @Column(name = "TrangThai")
    private Integer trangThai;
}
