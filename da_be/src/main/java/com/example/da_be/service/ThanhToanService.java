package com.example.da_be.service;

import com.example.da_be.dto.UpdateThanhToanStatusRequest;
import com.example.da_be.entity.ThanhToan;
import com.example.da_be.repository.ThanhToanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ThanhToanService {
    @Autowired
    private ThanhToanRepository thanhToanRepository;

    public List<ThanhToan> getAllThanhToan() {
        return thanhToanRepository.findAll();
    }

    public ThanhToan getThanhToanById(Long id) {
        Optional<ThanhToan> thanhToan = this.thanhToanRepository.findById(id);
        return thanhToan.orElseGet(ThanhToan::new);
    }

    public ThanhToan saveOrUpdateThanhToan(ThanhToan thanhToan) {
        return this.thanhToanRepository.save(thanhToan);
    }

    public void deleteThanhToanById(Long id) {
        this.thanhToanRepository.deleteById(id);
    }

    public ThanhToan updateThanhToanStatus(Long id, int status) {
        Optional<ThanhToan> optionalThanhToan = thanhToanRepository.findById(id); // Sử dụng thanhToanRepository
        if (optionalThanhToan.isPresent()) {
            ThanhToan thanhToan = optionalThanhToan.get();
            thanhToan.setTrangThai(status);
            return thanhToanRepository.save(thanhToan);
        }
        return null;
    }

    public ThanhToan getThanhToanByHoaDonId(Long hoaDonId) {
        return thanhToanRepository.findByHoaDonId(hoaDonId);
    }
}