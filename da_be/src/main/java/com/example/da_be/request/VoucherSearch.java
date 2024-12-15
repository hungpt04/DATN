package com.example.da_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherSearch {
    public String tenSearch;
    public LocalDateTime ngayBatDauSearch;
    public LocalDateTime ngayKetThucSearch;
    public Integer kieuSearch;
    public Integer kieuGiaTriSearch;
    public Integer trangThaiSearch;
}
