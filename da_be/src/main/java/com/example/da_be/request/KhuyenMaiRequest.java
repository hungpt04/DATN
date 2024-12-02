package com.example.da_be.request;

import com.example.da_be.entity.KhuyenMai;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class KhuyenMaiRequest {

    private String ten;

    private LocalDate tgBatDau;

    private LocalDate tgKetThuc;

    private Integer trangThai;

    private Integer giaTri;

    private Boolean loai;

    private List<Integer> idProductDetail;

    public KhuyenMai newKhuyenMaiAddSanPham(KhuyenMai khuyenMai) {
        khuyenMai.setTen(this.ten);
        khuyenMai.setTgBatDau(this.tgBatDau);
        khuyenMai.setTgKetThuc(this.tgKetThuc);
        khuyenMai.setGiaTri(this.giaTri);
        khuyenMai.setLoai(this.loai);
        if (LocalDate.now().isBefore(this.tgBatDau)) {
            khuyenMai.setTrangThai(0); // Sắp diễn ra
        } else if (LocalDate.now().isAfter(this.tgBatDau.minusDays(1)) && LocalDate.now().isBefore(this.tgKetThuc.plusDays(1))) {
            khuyenMai.setTrangThai(1); // Đang diễn ra
        } else {
            khuyenMai.setTrangThai(2); // Đã kết thúc
        }
        return khuyenMai;
    }
}
