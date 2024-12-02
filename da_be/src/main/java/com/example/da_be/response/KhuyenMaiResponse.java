package com.example.da_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMaiResponse {
    private Integer id;

    private String ten;

    private LocalDate tgBatDau;

    private LocalDate tgKetThuc;

    private Integer trangThai;

    private Integer giaTri;

    private Boolean loai;
}
