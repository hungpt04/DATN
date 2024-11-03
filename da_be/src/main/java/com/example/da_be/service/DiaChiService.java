package com.example.da_be.service;

import com.example.da_be.entity.DiaChi;
import com.example.da_be.repository.DiaChiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    public List<DiaChi> getAllDiaChi() {
        return diaChiRepository.findAll();
    }

    public DiaChi getDiaChiById(Long id) {
        Optional<DiaChi> diaChi = diaChiRepository.findById(id);
        return diaChi.orElseGet(DiaChi::new);
    }

    public DiaChi saveOrUpdateDiaChi(DiaChi diaChi) {
        return diaChiRepository.save(diaChi);
    }

    public void deleteDiaChiById(Long id) {
        diaChiRepository.deleteById(id);
    }

    // Thêm phương thức để lấy địa chỉ theo IdTaiKhoan
    public List<DiaChi> getDiaChiByTaiKhoanId(Long idTaiKhoan) {
        return diaChiRepository.findByTaiKhoan_Id(idTaiKhoan);
    }
}