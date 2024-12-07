package com.example.da_be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "TaiKhoan")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @Column(name = "Ma")
    private String ma;

    @Column(name = "HoTen", nullable = false)
    private String hoTen;

    @Column(name = "Sdt")
    private String sdt;

    @Column(name = "Email")
    private String email;

    @Column(name = "MatKhau")
    private String matKhau;

    @Column(name = "GioiTinh")
    private Integer gioiTinh;

    @Column(name = "VaiTro")
    private String vaiTro;

    @Column(name = "Avatar")
    private String avatar;

    @Column(name = "NgaySinh")
    private LocalDate ngaySinh;

    @Column(name = "CCCD")
    private String cccd;

    @Column(name = "TrangThai")
    private Integer trangThai;
}
