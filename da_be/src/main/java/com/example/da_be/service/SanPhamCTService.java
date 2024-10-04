package com.example.da_be.service;

import com.example.da_be.entity.SanPhamCT;
import com.example.da_be.repository.SanPhamCTRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SanPhamCTService {
    @Autowired
    private SanPhamCTRepository sanPhamCTRepository;

    public List<SanPhamCT> getAllSanPhamCT() {
        return sanPhamCTRepository.findAll();
    }

    public SanPhamCT getSanPhamCTById(int id) {
        Optional<SanPhamCT> sanPhamCT = this.sanPhamCTRepository.findById(id);
        return sanPhamCT.orElseGet(SanPhamCT::new);
    }

    public SanPhamCT saveOrUpdateSanPhamCT(SanPhamCT sanPhamCT) {
        return this.sanPhamCTRepository.save(sanPhamCT);
    }

    public void deleteSanPhamCTById(int id) {
        this.sanPhamCTRepository.deleteById(id);
    }


}
