package com.example.da_be.response;

import jakarta.persistence.ColumnResult;
import jakarta.persistence.ConstructorResult;
import jakarta.persistence.SqlResultSetMapping;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private Integer soLuongMua;
    private String hinhAnhLink;
}
