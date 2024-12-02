package com.example.da_be.controller;

import com.example.da_be.request.KhuyenMaiRequest;
import com.example.da_be.response.KhuyenMaiResponse;
import com.example.da_be.response.SanPhamCTResponse;
import com.example.da_be.response.SanPhamResponse;
import com.example.da_be.service.KhuyenMaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/khuyen-mai")
public class KhuyenMaiController {
    @Autowired
    private KhuyenMaiService khuyenMaiService;

    @GetMapping("/list-khuyen-mai")
    public List<KhuyenMaiResponse> getAllKhuyenMai() {
        return khuyenMaiService.getAllKhuyenMai();
    }

    @GetMapping("/list-san-pham")
    public List<SanPhamResponse> getAllSanPham() {
        return khuyenMaiService.getAllSanPham();
    }

    @GetMapping("/list-san-pham-chi-tiet")
    public List<SanPhamCTResponse> getAllSanPhamChiTiet() {
        return khuyenMaiService.getAllSanPhamChiTiet();
    }

    @GetMapping("/get-san-pham-chi-tiet-by-san-pham")
    public List<SanPhamCTResponse> getSanPhamChiTietBySanPham(@RequestParam List<Integer> id) {
        return khuyenMaiService.getSanPhamChiTietBySanPham(id);
    }

    @PostMapping("/add")
    public void addKhuyenMaiOnProduct(@RequestBody KhuyenMaiRequest khuyenMaiRequest) {
        khuyenMaiService.addKhuyenMaiOnProduct(khuyenMaiRequest);
    }

    @PutMapping("/update/{id}")
    public void updateKhuyenMai(@RequestBody KhuyenMaiRequest khuyenMaiRequest, @PathVariable Integer id) {
        khuyenMaiService.updateKhuyenMai(khuyenMaiRequest, id);
    }

    @GetMapping("/detail/{id}")
    public KhuyenMaiResponse getKhuyenMaiById(@PathVariable Integer id) {
        return khuyenMaiService.getKhuyenMaiById(id);
    }

    @GetMapping("/get-id-san-pham-va-san-pham-chi-tiet-by-id-khuyen-mai/{idKhuyenMai}")
    public List<Integer> getIdSanPhamVaSanPhamChiTietByIdKhuyenMai(@PathVariable Integer idKhuyenMai) {
        return khuyenMaiService.getIdSanPhamVaSanPhamChiTietByIdKhuyenMai(idKhuyenMai);
    }

    @PutMapping("/delete/{id}")
    public void deleteKhuyenMai(@PathVariable Integer id) {
        khuyenMaiService.deleteKhuyenMai(id);
    }
}
