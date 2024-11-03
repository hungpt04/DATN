package com.example.da_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DiaChi")
public class DiaChi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "IdTaiKhoan", referencedColumnName = "Id")
    private TaiKhoan taiKhoan;

    @Column(name = "Ten")
    private String ten;

    @Column(name = "Sdt")
    private String sdt;

    @Column(name = "IdTinh")
    private String idTinh;

    @Column(name = "IdHuyen")
    private String idHuyen;

    @Column(name = "IdXa")
    private String idXa;

    @Column(name = "DiaChiCuThe")
    private String diaChiCuThe;
}