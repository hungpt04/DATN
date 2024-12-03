package com.example.da_be.service;

import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.repository.TaiKhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaiKhoanService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    public List<TaiKhoan> getAllTaiKhoan() {
        return taiKhoanRepository.findAll();
    }

    public TaiKhoan getTaiKhoanById(int id) {
        Optional<TaiKhoan> taiKhoan = taiKhoanRepository.findById(id);
        return taiKhoan.orElse(null);
    }

    public TaiKhoan saveOrUpdateTaiKhoan(TaiKhoan taiKhoan) {
        return taiKhoanRepository.save(taiKhoan);
    }

    public TaiKhoan deleteTaiKhoanById(int id) {
        TaiKhoan taiKhoan = taiKhoanRepository.findById(id).orElse(null);
        assert taiKhoan != null;
        if (taiKhoan.getTrangThai() == 0) {
            taiKhoan.setTrangThai(1);
        } else {
            taiKhoan.setTrangThai(0);
        }
        return taiKhoanRepository.save(taiKhoan);
    }


}
