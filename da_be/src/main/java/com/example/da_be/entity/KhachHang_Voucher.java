package com.example.da_be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "KhachHang_Voucher")
public class KhachHang_Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "IdKhachHang", referencedColumnName = "Id")
    private TaiKhoan taiKhoan;

    @ManyToOne
    @JoinColumn(name = "IdVoucher" , referencedColumnName = "Id")
    private Voucher voucher;
}

