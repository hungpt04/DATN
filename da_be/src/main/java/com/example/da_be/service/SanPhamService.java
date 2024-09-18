package com.example.da_be.service;

import com.example.da_be.entity.SanPham;
import com.example.da_be.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SanPhamService {
    @Autowired
    private SanPhamRepository sanPhamRepository;

    public List<SanPham> getAllSanPham() {
        return sanPhamRepository.findAll();
    }

    public SanPham getSanPhamById(int id) {
        Optional<SanPham> sanPham = this.sanPhamRepository.findById(id);
        return sanPham.orElseGet(SanPham::new);
    }

    public SanPham saveOrUpdateSanPham(SanPham sanPham) {
        return this.sanPhamRepository.save(sanPham);
    }

    public void deleteSanPhamById(int id) {
        this.sanPhamRepository.deleteById(id);
    }
}
