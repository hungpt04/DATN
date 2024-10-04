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
@Table(name = "HinhAnh")
public class HinhAnh {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "IdSanPhamCT", referencedColumnName = "Id")
    private SanPhamCT sanPhamCT;


    @Column(name = "Link")
    private String link;

    @Column(name = "TrangThai")
    private Integer trangThai;
}
