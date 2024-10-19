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
@Table(name = "TaiKhoan")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

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
    private Date ngaySinh;

    @Column(name = "CCCD")
    private String cccd;

    @Column(name = "TrangThai")
    private Integer trangThai;
}
