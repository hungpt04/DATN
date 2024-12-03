package com.example.da_be.service;

import com.example.da_be.entity.DiaChi;
import com.example.da_be.repository.DiaChiRepository;
import com.example.da_be.repository.KhachHangRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    KhachHangRepository khachHangRepository;

    public List<DiaChi> getAllDiaChi() {
        return diaChiRepository.findAll();
    }

    public DiaChi getDiaChiById(Long id) {
        return diaChiRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Address not found with ID: " + id));
    }

    public DiaChi saveOrUpdateDiaChi(DiaChi diaChi) {
        try {
            DiaChi diaChi1;

            if (diaChi.getId() != null) {
                Optional<DiaChi> diaChi2 = diaChiRepository.findById(diaChi.getId());
                if (diaChi2.isPresent()) {
                    diaChi1 = diaChi.newDiaChi(diaChi2.get());
                }else {
                    throw new RuntimeException("Address with ID " + diaChi.getId() + " not found for update.");
                }
            }else {
                diaChi1 = diaChi.newDiaChi(new DiaChi());
                diaChi1.setTaiKhoan(khachHangRepository.findById(diaChi.getTaiKhoan().getId()).orElseThrow(() -> new RuntimeException("Customer not found.")));
            }

            return diaChiRepository.save(diaChi1);
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void deleteDiaChiById(Long id) {
        diaChiRepository.deleteById(id);
    }

    // Thêm phương thức để lấy địa chỉ theo IdTaiKhoan
    public List<DiaChi> getDiaChiByTaiKhoanId(Long idTaiKhoan) {
        return diaChiRepository.findByTaiKhoan_Id(idTaiKhoan);
    }

    public Long getIdDiaChiByIdTaiKhoan(Integer idTaiKhoan) {
        return diaChiRepository.getIdDiaChiByIdTaiKhoan(idTaiKhoan);
    }
}