package com.example.da_be.controller;

import com.example.da_be.entity.SanPham;
import com.example.da_be.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/sanpham")
public class SanPhamController {
    @Autowired
    private SanPhamService sanPhamService;

    @GetMapping
    public List<SanPham> getAllSanPham() {
        return sanPhamService.getAllSanPham();
    }

    @DeleteMapping("{id}")
    public void deleteSanPham(@PathVariable int id) {
        this.sanPhamService.deleteSanPhamById(id);
    }

    @PostMapping
    public SanPham addSanPham(@RequestBody SanPham sanPham) {
        return this.sanPhamService.saveOrUpdateSanPham(sanPham);
    }

    @PutMapping
    public SanPham updateSanPham(@RequestBody SanPham sanPham) {
        return this.sanPhamService.saveOrUpdateSanPham(sanPham);
    }
}
