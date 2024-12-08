package com.example.da_be.service;

import com.example.da_be.entity.KhuyenMai;
import com.example.da_be.request.KhuyenMaiRequest;
import com.example.da_be.request.KhuyenMaiSearch;
import com.example.da_be.request.SanPhamCTSearch;
import com.example.da_be.request.SanPhamSearch;
import com.example.da_be.response.KhuyenMaiResponse;
import com.example.da_be.response.SanPhamCTResponse;
import com.example.da_be.response.SanPhamResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface KhuyenMaiService {
    List<KhuyenMaiResponse> getAllKhuyenMai();
    List<SanPhamResponse> getAllSanPham();
    List<SanPhamCTResponse> getAllSanPhamChiTiet();
    List<SanPhamCTResponse> getSanPhamChiTietBySanPham(List<Integer> id);
    Page<SanPhamCTResponse> getSanPhamChiTietBySanPham(SanPhamCTSearch search, List<Integer> id, Pageable pageable);
    KhuyenMai addKhuyenMaiOnProduct(KhuyenMaiRequest khuyenMaiRequest);
    KhuyenMai updateKhuyenMai(KhuyenMaiRequest khuyenMaiRequest, Integer id);
    KhuyenMai deleteKhuyenMai(Integer id);
    KhuyenMaiResponse getKhuyenMaiById(Integer id);
    List<Integer> getIdSanPhamVaSanPhamChiTietByIdKhuyenMai(Integer idKhuyenMai);
    Page<KhuyenMaiResponse> getSearchKhuyenMai(KhuyenMaiSearch khuyenMaiSearch, Pageable pageable);
    Page<SanPhamResponse> getSearchSanPham(SanPhamSearch sanPhamSearch, Pageable pageable);
    Page<SanPhamCTResponse> phanTrangSanPhamCT(Pageable pageable);
    List<SanPhamCTResponse> fillterSanPhamCT(SanPhamCTSearch sanPhamCTSearch);
    List<String> getAllTenKhuyenMai();
}
