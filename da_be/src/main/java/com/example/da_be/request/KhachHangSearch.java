package com.example.da_be.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class KhachHangSearch {
    public String tenSearch;

    public String emailSearch;

    public String sdtSearch;

    public Integer gioiTinhSearch;

    public Integer  trangThaiSearch;
}
