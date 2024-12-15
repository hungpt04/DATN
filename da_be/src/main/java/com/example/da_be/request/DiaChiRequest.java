package com.example.da_be.request;

import com.example.da_be.entity.DiaChi;
import lombok.Data;

@Data
public class DiaChiRequest {
    private String ten;
    private String sdt;
    private String idTinh;
    private String idHuyen;
    private String idXa;
    private String diaChiCuThe;
    private Integer loai;
    private Integer idTaiKhoan;

    public DiaChi newDiaChi(DiaChi diaChi) {
        diaChi.setTen(this.ten);
        diaChi.setSdt(this.sdt);
        diaChi.setIdTinh(this.idTinh);
        diaChi.setIdHuyen(this.idHuyen);
        diaChi.setIdXa(this.idXa);
        diaChi.setDiaChiCuThe(this.diaChiCuThe);
        diaChi.setLoai(this.loai);
        return diaChi;
    }
}
