package com.example.da_be.service;

import com.example.da_be.entity.KhuyenMai;
import com.example.da_be.request.KhuyenMaiRequest;
import com.example.da_be.response.KhuyenMaiResponse;
import com.example.da_be.response.SanPhamCTResponse;
import com.example.da_be.response.SanPhamResponse;
import org.springframework.stereotype.Service;

import java.util.List;

public interface KhuyenMaiService {
    List<KhuyenMaiResponse> getAllKhuyenMai();
    List<SanPhamResponse> getAllSanPham();
    List<SanPhamCTResponse> getAllSanPhamChiTiet();
    List<SanPhamCTResponse> getSanPhamChiTietBySanPham(List<Integer> id);
    KhuyenMai addKhuyenMaiOnProduct(KhuyenMaiRequest khuyenMaiRequest);
    KhuyenMai updateKhuyenMai(KhuyenMaiRequest khuyenMaiRequest, Integer id);
    KhuyenMai deleteKhuyenMai(Integer id);
    KhuyenMaiResponse getKhuyenMaiById(Integer id);
    List<Integer> getIdSanPhamVaSanPhamChiTietByIdKhuyenMai(Integer idKhuyenMai);
}
