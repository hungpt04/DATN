package com.example.da_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class KhuyenMaiSearch {
    public String tenSearch;
    public LocalDate tgBatDauSearch;
    public LocalDate tgKetThucSearch;
    public Integer trangThaiSearch;

}