package com.example.da_be.service;

import com.example.da_be.entity.DiaChi;
import com.example.da_be.entity.DiemCanBang;
import com.example.da_be.repository.DiaChiRepository;
import com.example.da_be.repository.KhachHangRepository;
import com.example.da_be.request.DiaChiRequest;
import com.example.da_be.response.DiaChiResponse;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    public DiaChi saveOrUpdateDiaChii(DiaChi diaChi) {
        return this.diaChiRepository.save(diaChi);
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

    //Get all địa chỉ by idTaiKhoan của Hoàng
    public Page<DiaChiResponse> getAllDiaChiByIdTaiKhoan(Pageable pageable, Integer idTaiKhoan) {
        return diaChiRepository.getPageDiaChiByIdTaiKhoan(pageable, idTaiKhoan);
    }

    //Add địa chỉ của Hoàng
    public DiaChi add(DiaChiRequest diaChiRequest) {
        try {
            DiaChi diaChi = diaChiRequest.newDiaChi(new DiaChi());
            diaChi.setTaiKhoan(khachHangRepository.findById(diaChiRequest.getIdTaiKhoan()).orElseThrow(() -> new RuntimeException("Customer not found.")));
            return diaChiRepository.save(diaChi);
        }catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //Update địa chỉ của Hoàng
    public Boolean update(Long id, DiaChiRequest diaChiRequest) {
        Optional<DiaChi> optional = diaChiRepository.findById(id);
        if (optional.isPresent()) {
            DiaChi diaChi = diaChiRequest.newDiaChi(optional.get());
            diaChiRepository.save(diaChi);
            return true;
        }else {
            return false;
        }
    }


}