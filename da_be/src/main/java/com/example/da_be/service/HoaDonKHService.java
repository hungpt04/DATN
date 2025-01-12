package com.example.da_be.service;

import com.example.da_be.entity.HoaDon;
import com.example.da_be.repository.HoaDonKHRepository;
import com.example.da_be.repository.HoaDonRepository;
import com.example.da_be.response.HoaDonKHResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class HoaDonKHService {
    @Autowired
    private HoaDonKHRepository hoaDonKHRepository;

    public List<HoaDonKHResponse> getHoaDonKHByIdHoaDon(Long idHoaDon) {
        List<Object[]> results = hoaDonKHRepository.getHoaDonKHByIdHoaDon(idHoaDon);
        List<HoaDonKHResponse> responses = new ArrayList<>();

        for (Object[] result : results) {
            HoaDonKHResponse response = new HoaDonKHResponse();
            response.setHoaDonId((Integer) result[0]);
            response.setTenNguoiNhan((String) result[1]);
            response.setSdtNguoiNhan((String) result[2]);
            response.setDiaChiNguoiNhan((String) result[3]);
            response.setTongTien((BigDecimal) result[4]);
            response.setPhiShip((BigDecimal) result[5]);
            response.setSanPhamTen((String) result[6]);
            response.setGiaBan((BigDecimal) result[7]);
            response.setGiaKhuyenMai((BigDecimal) result[8]);
            response.setSoLuongMua((Integer) result[9]);
            response.setHinhAnhLink((String) result[10]);
            response.setGiaTriVoucher((Integer) result[11]);
            response.setKieuGiaTriVoucher((Integer) result[12]);
            response.setTrangThai((Integer) result[13]);
            responses.add(response);
        }

        return responses;
    }
}
