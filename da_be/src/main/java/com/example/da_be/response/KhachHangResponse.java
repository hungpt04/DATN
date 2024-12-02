package com.example.da_be.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangResponse {
    private Integer id;

    private String hoTen;

    private String sdt;

    private String email;

    private LocalDate ngaySinh;
}
