package com.example.da_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DiaChiResponse {
    private Long id;

    private String ten;

    private String sdt;

    private String idTinh;

    private String idHuyen;

    private String idXa;

    private String diaChiCuThe;

    private Integer loai;
}
