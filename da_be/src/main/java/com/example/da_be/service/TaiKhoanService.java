package com.example.da_be.service;

import com.example.da_be.config.JwtTokenProvider;
import com.example.da_be.entity.TaiKhoan;
import com.example.da_be.exception.ResourceNotFoundException;
import com.example.da_be.repository.TaiKhoanRepository;
import com.google.gson.JsonParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaiKhoanService {
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

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

    public TaiKhoan getMyInfo(String token) {
        try {
            String email = jwtTokenProvider.getEmailFromJwtToken(token);
            TaiKhoan taiKhoan = taiKhoanRepository.findByEmail(email);

            // Kiểm tra xem tài khoản có tồn tại không
            if (taiKhoan == null) {
                throw new ResourceNotFoundException("Tài khoản không tồn tại với email: " + email);
            }

            return taiKhoan;
        } catch (JsonParseException e) {
            throw new RuntimeException("Token không hợp lệ: " + e.getMessage());
        } catch (Exception e) {
            throw new RuntimeException("Đã xảy ra lỗi: " + e.getMessage());
        }
    }
}
