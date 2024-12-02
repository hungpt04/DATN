package com.example.da_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "KhuyenMai")
public class KhuyenMai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Ten")
    private String ten;

    @Column(name = "TG_BatDau")
    private LocalDate tgBatDau;

    @Column(name = "TG_KetThuc")
    private LocalDate tgKetThuc;

    @Column(name = "TrangThai")
    private Integer trangThai;

    @Column(name = "GiaTri")
    private Integer giaTri;

    @Column(name = "Loai")
    private Boolean loai;
}
