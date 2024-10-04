package com.example.da_be.service;

import com.example.da_be.entity.HinhAnh;
import com.example.da_be.repository.HinhAnhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HinhAnhService {
    @Autowired
    private HinhAnhRepository hinhAnhRepository;

    public List<HinhAnh> getAllHinhAnh() {
        return hinhAnhRepository.findAll();
    }

    public HinhAnh getHinhAnhById(int id) {
        Optional<HinhAnh> hinhAnh = this.hinhAnhRepository.findById(id);
        return hinhAnh.orElseGet(HinhAnh::new);
    }

    public HinhAnh saveOrUpdateHinhAnh(HinhAnh hinhAnh) {
        return this.hinhAnhRepository.save(hinhAnh);
    }

    public void deleteHinhAnhById(int id) {
        this.hinhAnhRepository.deleteById(id);
    }
}
