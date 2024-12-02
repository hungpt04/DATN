package com.example.da_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherSearch {
    public String tenSearch;
    public LocalDate ngayBatDauSearch;
    public LocalDate ngayKetThucSearch;
    public Integer kieuSearch;
    public Integer kieuGiaTriSearch;
    public Integer trangThaiSearch;
}
