package com.example.da_be.request;

import com.example.da_be.entity.KhuyenMai;
import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.entity.SanPhamKhuyenMai;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamRequest {
    private KhuyenMai khuyenMai;
    private SanPhamCT sanPhamChiTiet;

    public SanPhamKhuyenMai newSanPhamKhuyenMai(SanPhamKhuyenMai sanPhamKhuyenMai) {
        sanPhamKhuyenMai.setKhuyenMai(this.khuyenMai);
        sanPhamKhuyenMai.setSanPhamCT(this.sanPhamChiTiet);
        return sanPhamKhuyenMai;
    }
}
