package com.example.da_be.service;

import com.example.da_be.entity.LichSuDonHang;
import com.example.da_be.exception.ResourceNotFoundException;
import com.example.da_be.repository.LichSuDonHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LichSuDonHangService {
    @Autowired
    private LichSuDonHangRepository lichSuDonHangRepository;

    public List<LichSuDonHang> getAllLichSuDonHang() {
        return lichSuDonHangRepository.findAll();
    }

    public LichSuDonHang getLichSuDonHangById(int id) {
        return lichSuDonHangRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LichSuDonHang not found with id " + id));
    }

    public LichSuDonHang saveOrUpdateLichSuDonHang(LichSuDonHang lichSuDonHang) {
        return lichSuDonHangRepository.save(lichSuDonHang);
    }

    public void deleteLichSuDonHangById(int id) {
        lichSuDonHangRepository.deleteById(id);
    }

    public List<LichSuDonHang> getLichSuDonHangByHoaDonId(int hoaDonId) {
        return lichSuDonHangRepository.findByHoaDonId(hoaDonId);
    }
}