package com.example.da_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherResponse {
    private Integer id;

    private String ma;

    private String ten;

    private Integer giaTri;

    private Integer giaTriMax;

    private Integer dieuKienNhoNhat;

    private Integer kieu;

    private Integer soLuong;

    private LocalDateTime ngayBatDau;

    private LocalDateTime ngayKetThuc;

    private Integer trangThai;

    private Integer kieuGiaTri;
}
